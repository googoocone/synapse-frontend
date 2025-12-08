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
        const { newPlanId } = body;

        if (!newPlanId) {
            return NextResponse.json(
                { error: "변경할 플랜 정보가 없습니다." },
                { status: 400 }
            );
        }

        // 3. 활성 구독 정보 가져오기
        const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

        if (subError || !subscription) {
            return NextResponse.json(
                { error: "활성화된 구독이 없습니다." },
                { status: 404 }
            );
        }

        if (subscription.plan_id === newPlanId) {
            return NextResponse.json(
                { error: "이미 해당 플랜을 이용 중입니다." },
                { status: 400 }
            );
        }

        // 4. 플랜 변경 예약 (다음 결제일에 반영)
        const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
                scheduled_plan_id: newPlanId,
                cancel_at_period_end: false, // 혹시 취소 예약 상태였다면 해제
            })
            .eq("id", subscription.id);

        if (updateError) {
            return NextResponse.json(
                { error: "플랜 변경 예약에 실패했습니다." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "플랜 변경이 예약되었습니다. 다음 결제일부터 적용됩니다.",
            nextBillingDate: subscription.next_billing_date,
        });

    } catch (error) {
        console.error("플랜 변경 API 에러:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
