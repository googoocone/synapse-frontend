
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, content } = body;

        // 간단한 유효성 검사
        if (!name || !email || !content) {
            return NextResponse.json(
                { error: "필수 입력 항목이 누락되었습니다." },
                { status: 400 }
            );
        }

        // 서비스 롤 키를 사용하여 Admin 클라이언트 생성 (RLS 우회)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabaseAdmin
            .from("inquiries")
            .insert([
                {
                    name,
                    email,
                    content,
                    status: "pending",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase Insert Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Inquiry API Error:", error);
        return NextResponse.json(
            { error: "문의 접수 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
