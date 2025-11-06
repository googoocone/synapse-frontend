// components/HeaderMenu.tsx
"use client";

import Menu from "@/assets/menu.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const menuItems = [
    { label: "홈", href: "/" },
    { label: "Foundary 구독", href: "/subscription" },
    // { label: "고객센터", href: "/support" },
    { label: "1:1문의", href: "/inquiry" },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* 메뉴 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 z-30 relative cursor-pointer"
        aria-label="메뉴 열기"
      >
        <Image src={Menu} alt="메뉴" width={24} height={24} />
      </button>

      {/* 모바일: 오버레이 */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 top-[50px] md:top-[60px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 모바일: 드롭다운 메뉴 (헤더 아래) */}
      {isMobile ? (
        <div
          className={`fixed left-0 right-0 top-[50px] bg-[#FF7A00] shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-black/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        /* 데스크탑: 드롭다운 메뉴 */
        isOpen && (
          <div className="absolute top-full left-0 mt-2 w-[220px] bg-[#FF7A00] rounded-lg shadow-xl z-50 py-2">
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-white hover:bg-black/10 transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )
      )}
    </div>
  );
}
