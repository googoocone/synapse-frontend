// components/Header.tsx

import logoImage from "@/assets/logo.png";
import LogoutButton from "@/components/ui/LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 z-20 w-full h-[72px] flex items-center justify-between px-6 sm:px-8 border-b border-black/10 bg-white">
      {/* 로고 */}
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image src={logoImage} alt="Synapse AI 로고" width={48} height={48} />
        <p className="font-bold text-lg hidden sm:block text-[#214061]/80">
          Korea Riches
        </p>
      </Link>

      <nav className="flex-1">
        <ul className="flex flex-row items-center justify-center gap-8">
          {/* <Link
            href="/"
            className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors text-[#214061]/60 hover:text-[#214061]"
          >
            홈
          </Link>
          <Link
            href="/blog"
            className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors text-[#214061]/60 hover:text-[#214061]"
          >
            창업사례
          </Link>
          <Link
            href="/discovery"
            className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors text-[#214061]/60 hover:text-[#214061]"
          >
            창업 아이템 추천
          </Link> */}
        </ul>
      </nav>

      <div className="flex items-center justify-end gap-3 text-sm ">
        {user ? (
          <>
            <span className="hidden sm:block">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="px-4 py-2 rounded-md bg-[#214061] text-white hover:bg-[#214061]/80 transition-colors cursor-pointer">
                시작하기
              </button>
            </Link>
            {/* <Link href="/signup">
              <button className="px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                무료로 회원가입
              </button>
            </Link> */}
          </>
        )}
      </div>
    </header>
  );
}
