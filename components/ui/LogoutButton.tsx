// components/LogoutButton.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* 메인 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm"
      >
        내 계정
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[160px] bg-white rounded-lg shadow-xl z-50 py-2 border border-gray-100">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/mypage"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-[#222222] hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  마이페이지
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-[#222222] hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
