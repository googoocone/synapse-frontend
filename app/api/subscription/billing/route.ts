// app/api/subscription/billing/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. 요청 데이터 파싱
    const body = await request.json();
    const { customerKey, authKey, planId } = body;

    if (!customerKey || !authKey || !planId) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 3. 선택한 플랜 정보 가져오기
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "존재하지 않는 플랜입니다." },
        { status: 404 }
      );
    }

    // 4. 토스 페이먼츠에 빌링키 발급 요청
    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/billing/authorizations/issue",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TOSS_SECRET_KEY}:`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authKey,
          customerKey,
        }),
      }
    );

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error("토스 빌링키 발급 실패:", tossData);
      return NextResponse.json(
        { error: tossData.message || "빌링키 발급에 실패했습니다." },
        { status: 400 }
      );
    }

    // 5. 빌링키 발급 성공! 이제 실제 첫 결제 진행
    const billingKey = tossData.billingKey;
    const customerEmail = tossData.card?.customerEmail || user.email;

    // 6. 첫 결제 실행
    const paymentResponse = await fetch(
      `https://api.tosspayments.com/v1/billing/${billingKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TOSS_SECRET_KEY}:`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerKey,
          amount: plan.price,
          orderId: `order_${user.id}_${Date.now()}`,
          orderName: plan.name,
          customerEmail,
          customerName: user.user_metadata?.name || user.email,
        }),
      }
    );

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("첫 결제 실패:", paymentData);
      return NextResponse.json(
        { error: paymentData.message || "결제에 실패했습니다." },
        { status: 400 }
      );
    }

    // 7. 구독 정보 DB에 저장
    const now = new Date();
    const expiresAt = new Date(now);
    const nextBillingDate = new Date(now);

    if (plan.billing_cycle === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else if (plan.billing_cycle === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // 8. 기존 구독이 있는지 확인
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let subscriptionResult;

    if (existingSubscription) {
      // 기존 구독 업데이트
      subscriptionResult = await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          billing_key: billingKey,
          customer_key: customerKey,
          status: "active",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      // 새 구독 생성
      subscriptionResult = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_id: planId,
          billing_key: billingKey,
          customer_key: customerKey,
          status: "active",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
        })
        .select()
        .single();
    }

    if (subscriptionResult.error) {
      console.error("구독 정보 저장 실패:", subscriptionResult.error);
      return NextResponse.json(
        { error: "구독 정보 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // 9. 결제 내역 저장
    const { error: historyError } = await supabase
      .from("payment_history")
      .insert({
        user_id: user.id,
        subscription_id: subscriptionResult.data.id,
        amount: plan.price,
        status: "success",
        payment_method: paymentData.method || "카드",
        payment_key: paymentData.paymentKey,
        order_id: paymentData.orderId,
      });

    if (historyError) {
      console.error("결제 내역 저장 실패:", historyError);
    }

    // 10. 성공 응답
    return NextResponse.json({
      success: true,
      subscription: subscriptionResult.data,
      payment: paymentData,
    });
  } catch (error) {
    console.error("빌링키 발급 API 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
