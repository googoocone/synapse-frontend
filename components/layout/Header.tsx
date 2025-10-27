// components/Header.tsx
"use client";

import Menu from "@/assets/menu.png";
import LogoutButton from "@/components/ui/LogoutButton";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu as MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 링크 클릭 시 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 mx-auto z-20 w-full sm:max-w-[95%] lg:max-w-[1200px] h-[50px] md:h-[60px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-[#FF7A00] sm:rounded-md">
        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white p-1"
          aria-label="메뉴 열기"
        >
          <MenuIcon size={24} />
        </button>

        {/* 로고 (모바일에서는 숨김) */}
        <Link
          href="/"
          className="hidden md:flex items-center justify-center gap-2"
        >
          <Image src={Menu} alt="Foundary 로고" width={24} height={24} />
        </Link>

        {/* 중앙 타이틀 */}
        <nav className="flex-1 md:flex-none">
          <Link href="/" onClick={closeMobileMenu}>
            <ul className="flex flex-row items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-white">
              Foundary
            </ul>
          </Link>
        </nav>

        {/* 데스크톱 로그인/로그아웃 버튼 */}
        <div className="hidden md:flex items-center justify-end gap-3 text-sm">
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

        {/* 모바일 로그인 버튼 */}
        <div className="md:hidden">
          {user ? (
            <button
              onClick={toggleMobileMenu}
              className="px-2 py-1 text-xs rounded-md bg-white text-black font-semibold"
            >
              메뉴
            </button>
          ) : (
            <Link href="/login">
              <button className="px-3 py-1.5 text-xs rounded-md bg-white text-black font-semibold">
                로그인
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* 모바일 사이드 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* 모바일 사이드 메뉴 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 메뉴 헤더 */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <Link href="/" onClick={closeMobileMenu}>
              <h2 className="text-lg sm:text-xl font-bold text-[#FF7A00]">
                Foundary
              </h2>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="메뉴 닫기"
            >
              <X size={24} />
            </button>
          </div>

          {/* 메뉴 아이템 */}
          <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block text-base sm:text-lg font-medium text-gray-800 hover:text-[#FF7A00] transition-colors py-2 px-3 rounded-md hover:bg-orange-50"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  onClick={closeMobileMenu}
                  className="block text-base sm:text-lg font-medium text-gray-800 hover:text-[#FF7A00] transition-colors py-2 px-3 rounded-md hover:bg-orange-50"
                >
                  성공사례
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link
                      href="/admin/write"
                      onClick={closeMobileMenu}
                      className="block text-base sm:text-lg font-medium text-gray-800 hover:text-[#FF7A00] transition-colors py-2 px-3 rounded-md hover:bg-orange-50"
                    >
                      글쓰기
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/edit"
                      onClick={closeMobileMenu}
                      className="block text-base sm:text-lg font-medium text-gray-800 hover:text-[#FF7A00] transition-colors py-2 px-3 rounded-md hover:bg-orange-50"
                    >
                      내 글 관리
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* 하단 로그인/로그아웃 */}
          <div className="p-4 sm:p-6 border-t">
            {user ? (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {user.email}
                </p>
                <LogoutButton />
              </div>
            ) : (
              <Link href="/login" onClick={closeMobileMenu}>
                <button className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-md bg-[#FF7A00] text-white font-semibold hover:bg-[#FF7A00]/90 transition-colors">
                  로그인
                </button>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
