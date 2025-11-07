// app/api/subscription/charge/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. 요청 인증 (Cron Job 또는 관리자만 호출 가능하도록)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 오늘 결제해야 할 구독 찾기
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: subscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("status", "active")
      .lte("next_billing_date", today);

    if (fetchError) {
      console.error("구독 조회 실패:", fetchError);
      return NextResponse.json(
        { error: "구독 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "오늘 결제할 구독이 없습니다.",
        count: 0,
      });
    }

    console.log(`${subscriptions.length}개의 구독 결제 시작`);

    // 3. 각 구독에 대해 결제 진행
    const results = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const plan = subscription.subscription_plans;

          // 사용자 정보 가져오기
          const { data: userData } = await supabase.auth.admin.getUserById(
            subscription.user_id
          );

          if (!userData?.user) {
            throw new Error("사용자 정보를 찾을 수 없습니다.");
          }

          // 토스 페이먼츠 자동 결제 실행
          const paymentResponse = await fetch(
            `https://api.tosspayments.com/v1/billing/${subscription.billing_key}`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${process.env.TOSS_SECRET_KEY}:`
                ).toString("base64")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerKey: subscription.customer_key,
                amount: plan.price,
                orderId: `auto_${subscription.id}_${Date.now()}`,
                orderName: plan.name,
                customerEmail: userData.user.email,
                customerName:
                  userData.user.user_metadata?.name || userData.user.email,
              }),
            }
          );

          const paymentData = await paymentResponse.json();

          if (!paymentResponse.ok) {
            throw new Error(paymentData.message || "결제 실패");
          }

          // 결제 성공 - 다음 결제일 업데이트
          const currentNextBilling = new Date(subscription.next_billing_date);
          const newNextBilling = new Date(currentNextBilling);
          const newExpires = new Date(currentNextBilling);

          if (plan.duration_months === 1) {
            newNextBilling.setMonth(newNextBilling.getMonth() + 1);
            newExpires.setMonth(newExpires.getMonth() + 1);
          } else if (plan.duration_months === 12) {
            newNextBilling.setFullYear(newNextBilling.getFullYear() + 1);
            newExpires.setFullYear(newExpires.getFullYear() + 1);
          }

          // 구독 정보 업데이트
          await supabase
            .from("subscriptions")
            .update({
              next_billing_date: newNextBilling.toISOString(),
              expires_at: newExpires.toISOString(),
            })
            .eq("id", subscription.id);

          // 결제 내역 저장
          await supabase.from("payment_history").insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            amount: plan.price,
            status: "success",
            payment_method: paymentData.method || "카드",
            payment_key: paymentData.paymentKey,
            order_id: paymentData.orderId,
          });

          return {
            success: true,
            subscriptionId: subscription.id,
            userId: subscription.user_id,
            amount: plan.price,
          };
        } catch (error: any) {
          console.error(`구독 ${subscription.id} 결제 실패:`, error);

          // 결제 실패 내역 저장
          await supabase.from("payment_history").insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            amount: subscription.subscription_plans.price,
            status: "failed",
            payment_method: "카드",
            order_id: `auto_${subscription.id}_${Date.now()}`,
          });

          // 연속 3번 실패 시 구독 중지
          const { data: failedPayments } = await supabase
            .from("payment_history")
            .select("*")
            .eq("subscription_id", subscription.id)
            .eq("status", "failed")
            .order("created_at", { ascending: false })
            .limit(3);

          if (failedPayments && failedPayments.length >= 3) {
            await supabase
              .from("subscriptions")
              .update({ status: "payment_failed" })
              .eq("id", subscription.id);
          }

          return {
            success: false,
            subscriptionId: subscription.id,
            userId: subscription.user_id,
            error: error.message,
          };
        }
      })
    );

    // 4. 결과 요약
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: "자동 결제 완료",
      total: subscriptions.length,
      success: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    console.error("자동 결제 API 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET 요청으로 상태 확인
export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, user_id, next_billing_date, status")
      .eq("status", "active")
      .lte("next_billing_date", today);

    if (error) throw error;

    return NextResponse.json({
      message: "오늘 결제할 구독 목록",
      count: data?.length || 0,
      subscriptions: data,
    });
  } catch (error) {
    console.error("조회 에러:", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
