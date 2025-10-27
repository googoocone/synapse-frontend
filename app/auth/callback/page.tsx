// app/auth/callback/page.tsx

"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (code) {
        // Supabase가 자동으로 세션을 처리합니다
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("인증 오류:", error);
          router.push("/auth/auth-code-error");
          return;
        }

        console.log("로그인 성공!");
        // 성공 시 홈으로 리다이렉트하고 새로고침
        router.refresh();
        router.push("/");
      }
    };

    handleCallback();
  }, [router, searchParams, supabase.auth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리중...</p>
      </div>
    </div>
  );
}
