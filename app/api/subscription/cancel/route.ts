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

    // 2. 활성 구독 정보 가져오기
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "활성화된 구독이 없습니다." },
        { status: 404 }
      );
    }

    const now = new Date();
    const startedAt = new Date(subscription.started_at);
    const diffTime = Math.abs(now.getTime() - startedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 3. 3일 이내 취소 여부 확인
    if (diffDays <= 3) {
      // 3일 이내: 수수료 5% 제외 후 전액 환불
      const paymentKey = subscription.payment_key; // 결제 키가 필요함. subscriptions 테이블에 payment_key가 있다고 가정하거나 payment_history에서 가져와야 함.

      // payment_history에서 최신 결제 정보 가져오기 (payment_key를 얻기 위해)
      const { data: lastPayment } = await supabase
        .from("payment_history")
        .select("*")
        .eq("subscription_id", subscription.id)
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!lastPayment || !lastPayment.payment_key) {
        return NextResponse.json(
          { error: "결제 정보를 찾을 수 없어 환불을 진행할 수 없습니다." },
          { status: 400 }
        );
      }

      const cancelAmount = Math.floor(lastPayment.amount * 0.95); // 5% 수수료 제외
      const cancelReason = "3일 이내 단순 변심 취소 (수수료 5% 차감)";

      // 토스 페이먼츠 취소 API 호출
      const cancelResponse = await fetch(
        `https://api.tosspayments.com/v1/payments/${lastPayment.payment_key}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TOSS_SECRET_KEY}:`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cancelReason,
            cancelAmount,
          }),
        }
      );

      const cancelData = await cancelResponse.json();

      if (!cancelResponse.ok) {
        console.error("토스 결제 취소 실패:", cancelData);
        return NextResponse.json(
          { error: cancelData.message || "환불 처리에 실패했습니다." },
          { status: 400 }
        );
      }

      // 구독 상태 업데이트 (취소됨)
      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", cancel_at_period_end: false })
        .eq("id", subscription.id);

      // 환불 내역 저장
      await supabase.from("payment_history").insert({
        user_id: user.id,
        subscription_id: subscription.id,
        amount: -cancelAmount, // 환불 금액은 음수로 표기하거나 별도 status로 구분
        status: "refunded",
        payment_method: lastPayment.payment_method,
        payment_key: lastPayment.payment_key,
        order_id: lastPayment.order_id,
      });

      return NextResponse.json({
        success: true,
        message: "3일 이내 취소로 수수료 제외 후 환불되었습니다.",
        refundAmount: cancelAmount,
      });

    } else {
      // 3일 이후: 다음 결제일에 해지 (구독 유지)
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ cancel_at_period_end: true })
        .eq("id", subscription.id);

      if (updateError) {
        return NextResponse.json(
          { error: "구독 해지 예약에 실패했습니다." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "구독 해지가 예약되었습니다. 남은 기간 동안 이용 가능합니다.",
        expiresAt: subscription.expires_at,
      });
    }

  } catch (error) {
    console.error("구독 취소 API 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
