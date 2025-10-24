// components/Header.tsx

import logoImage from "@/assets/logo.png";
import LogoutButton from "@/components/ui/LogoutButton";
import Menu from "@/assets/menu.png";
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
    <header className="fixed  top-0 left-0 right-0 mx-auto z-20 w-[1200px] h-[50px] flex items-center justify-between px-6 sm:px-8 bg-[#FF7A00] rounded-md">
      {/* 로고 */}
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image src={Menu} alt="Synapse AI 로고" width={24} height={24} />
      </Link>

      <nav className="flex-1">
        <Link href="/">
          <ul className="flex flex-row items-center justify-center text-[32px] font-black text-white">
            Foundary
          </ul>
        </Link>
      </nav>

      <div className="flex items-center justify-end gap-3 text-sm ">
        {user ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="px-4 py-2 rounded-md bg-white text-black hover:bg-[#214061]/80 hover:text-white font-semibold transition-colors cursor-pointer">
                로그인
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
