import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    // Vercel Cron 인증 (선택 사항이지만 권장됨)
    const authHeader = request.headers.get("authorization");
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const supabase = await createClient();
        const now = new Date();

        // 1. 갱신 대상 구독 가져오기 (active 상태이고 next_billing_date가 지났거나 오늘인 경우)
        const { data: subscriptions, error: subError } = await supabase
            .from("subscriptions")
            .select("*, users(email, user_metadata)")
            .eq("status", "active")
            .lte("next_billing_date", now.toISOString());

        if (subError) {
            console.error("구독 조회 실패:", subError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: "No subscriptions to renew" });
        }

        const results = [];

        // 2. 각 구독 처리
        for (const sub of subscriptions) {
            try {
                // 2-1. 해지 예약된 경우 -> 해지 처리
                if (sub.cancel_at_period_end) {
                    await supabase
                        .from("subscriptions")
                        .update({ status: "cancelled" })
                        .eq("id", sub.id);
                    results.push({ id: sub.id, status: "cancelled" });
                    continue;
                }

                // 2-2. 결제할 플랜 결정 (예약된 플랜이 있으면 그것으로, 없으면 기존 플랜)
                const planIdToCharge = sub.scheduled_plan_id || sub.plan_id;

                // 플랜 정보 가져오기
                const { data: plan } = await supabase
                    .from("subscription_plans")
                    .select("*")
                    .eq("id", planIdToCharge)
                    .single();

                if (!plan) {
                    console.error(`Plan not found for subscription ${sub.id}`);
                    results.push({ id: sub.id, status: "failed", reason: "Plan not found" });
                    continue;
                }

                // 2-3. 토스 페이먼츠 결제 요청
                const orderId = `renew_${sub.id}_${Date.now()}`;
                const paymentResponse = await fetch(
                    `https://api.tosspayments.com/v1/billing/${sub.billing_key}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Basic ${Buffer.from(
                                `${process.env.TOSS_SECRET_KEY}:`
                            ).toString("base64")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            customerKey: sub.customer_key,
                            amount: plan.price,
                            orderId: orderId,
                            orderName: `[정기결제] ${plan.name}`,
                            customerEmail: sub.users?.email,
                            customerName: sub.users?.user_metadata?.name || "Customer",
                        }),
                    }
                );

                const paymentData = await paymentResponse.json();

                if (!paymentResponse.ok) {
                    console.error(`Renewal failed for ${sub.id}:`, paymentData);
                    // 결제 실패 시 상태 업데이트 (예: past_due)
                    await supabase
                        .from("subscriptions")
                        .update({ status: "past_due" })
                        .eq("id", sub.id);

                    results.push({ id: sub.id, status: "failed", reason: paymentData.message });
                    continue;
                }

                // 2-4. 결제 성공 시 구독 정보 갱신
                const nextBillingDate = new Date();
                const expiresAt = new Date();

                if (plan.billing_cycle === "monthly") {
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                    expiresAt.setMonth(expiresAt.getMonth() + 1);
                } else if (plan.billing_cycle === "yearly") {
                    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                }

                const updateData: any = {
                    next_billing_date: nextBillingDate.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    status: "active",
                };

                // 플랜 변경이 있었다면 반영
                if (sub.scheduled_plan_id) {
                    updateData.plan_id = sub.scheduled_plan_id;
                    updateData.scheduled_plan_id = null;
                }

                await supabase
                    .from("subscriptions")
                    .update(updateData)
                    .eq("id", sub.id);

                // 2-5. 결제 내역 저장
                await supabase.from("payment_history").insert({
                    user_id: sub.user_id,
                    subscription_id: sub.id,
                    amount: plan.price,
                    status: "success",
                    payment_method: paymentData.method || "카드",
                    payment_key: paymentData.paymentKey,
                    order_id: orderId,
                });

                results.push({ id: sub.id, status: "renewed" });

            } catch (error: any) {
                console.error(`Error processing subscription ${sub.id}:`, error);
                results.push({ id: sub.id, status: "error", error: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
        });

    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
