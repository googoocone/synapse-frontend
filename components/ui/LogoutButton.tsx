// components/LogoutButton.tsx
"use client";

import { createClient } from "@/utils/supabase/client"; // 클라이언트용 클라이언트
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // 페이지를 새로고침하여 헤더의 로그인 상태를 업데이트
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      로그아웃
    </button>
  );
}
