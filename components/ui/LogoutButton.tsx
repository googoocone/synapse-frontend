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
        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-black/80 text-black/80 hover:bg-black/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm"
      >
        내 계정
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[160px] bg-[#ff5833] rounded-lg shadow-xl z-50 py-2 ">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/mypage"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-gray-700  transition-colors font-medium text-sm hover:text-white"
                >
                  마이페이지
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-[#ff5833] hover:text-white transition-colors font-medium text-sm cursor-pointer"
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
