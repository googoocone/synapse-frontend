// components/Header.tsx

import logoImage from "@/assets/logo.png";
import LogoutButton from "@/components/ui/LogoutButton"; // 2단계에서 만들 로그아웃 버튼
import { createClient } from "@/utils/supabase/server"; // 서버용 클라이언트
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

// 1. 컴포넌트를 async 함수로 변경
export default async function Header() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // 2. 서버에서 현재 사용자 정보를 가져옵니다.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  return (
    <header className="w-full h-[72px] flex items-center justify-between px-4 sm:px-8 border-b border-black/10">
      {/* 로고를 클릭하면 홈으로 이동하도록 Link 추가 */}
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image src={logoImage} alt="Synapse AI 로고" width={36} height={34} />
        <p className="font-bold text-lg hidden sm:block">Synapse AI</p>
      </Link>

      {/* 3. 로그인 상태에 따라 다른 UI를 보여줍니다. */}
      <div className="flex items-center justify-center gap-3 text-sm">
        {user ? (
          // 로그인된 경우
          <>
            <span className="hidden sm:block">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          // 로그아웃된 경우
          <>
            <Link href="/login">
              <button className="px-4 py-1.5 rounded-md bg-black text-white hover:bg-gray-800 transition-colors">
                로그인
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                무료로 회원가입
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
