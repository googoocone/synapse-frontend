// components/Header.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;

import HeaderMenu from "@/components/layout/HeaderMenu";
import LogoutButton from "@/components/ui/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[Header] User:", user?.email || "Not logged in");
  console.log("[Header] User ID:", user?.id || "No ID");

  return (
    <header className="fixed top-0 left-0 right-0 mx-auto z-20 w-full max-w-[1200px] h-[50px] md:h-[60px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-[#ff5833] rounded-none md:rounded-md">
      {/* 왼쪽: 메뉴 + Foundary (모바일) */}
      <div className="flex items-center gap-2 md:flex-none md:w-auto">
        <HeaderMenu />

        {/* 모바일에서만 보이는 Foundary */}
        <Link href="/" className="md:hidden">
          <span className="text-xl font-black text-white">Foundary</span>
        </Link>
      </div>

      {/* 중앙: Foundary (데스크탑) */}
      <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link href="/">
          <span className="text-2xl md:text-[32px] font-black text-white whitespace-nowrap">
            Foundary
          </span>
        </Link>
      </nav>

      {/* 오른쪽: 버튼들 */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 text-xs sm:text-sm">
        {user ? (
          <>
            <Link href="/subscription" className="hidden md:block">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-black text-white hover:bg-[#214061]/80 hover:text-white font-semibold transition-colors cursor-pointer whitespace-nowrap">
                구독하기
              </button>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            {/* 구독하기 버튼 - 데스크탑에서만 보임 */}
            <Link href="/subscription" className=" md:block">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-black text-white hover:bg-[#214061]/80 hover:text-white font-semibold transition-colors cursor-pointer whitespace-nowrap">
                구독하기
              </button>
            </Link>
            <Link href="/login">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white text-black hover:bg-[#214061]/80 hover:text-white font-semibold transition-colors cursor-pointer whitespace-nowrap">
                로그인
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
