// components/Header.tsx
"use client";

import Menu from "@/assets/menu.png";
import LogoutButton from "@/components/ui/LogoutButton";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    console.log("user", user);

    getUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <header className="fixed top-0 left-0 right-0 mx-auto z-20 w-[1200px] h-[50px] flex items-center justify-between px-6 sm:px-8 bg-[#FF7A00] rounded-md">
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

      <div className="flex items-center justify-end gap-3 text-sm">
        {user ? (
          <LogoutButton />
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 rounded-md bg-white text-black hover:bg-[#214061]/80 hover:text-white font-semibold transition-colors cursor-pointer">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
