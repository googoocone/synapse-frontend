// app/api/subscription/cancel/route.ts
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

    // 2. 사용자의 활성 구독 찾기
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: "활성화된 구독을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 3. 구독 상태를 'cancelled'로 변경
    // (expires_at까지는 서비스 이용 가능)
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (updateError) {
      console.error("구독 취소 실패:", updateError);
      return NextResponse.json(
        { error: "구독 취소에 실패했습니다." },
        { status: 500 }
      );
    }

    // 4. 성공 응답
    return NextResponse.json({
      success: true,
      message: "구독이 취소되었습니다.",
      expiresAt: subscription.expires_at,
      note: "구독 만료일까지는 서비스를 계속 이용하실 수 있습니다.",
    });
  } catch (error) {
    console.error("구독 취소 API 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET: 현재 구독 상태 조회
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", user.id)
      .single();

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        message: "활성화된 구독이 없습니다.",
      });
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription,
    });
  } catch (error) {
    console.error("구독 조회 에러:", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
