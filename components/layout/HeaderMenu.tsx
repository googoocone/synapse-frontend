// components/HeaderMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/assets/menu.png";

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
    { label: "고객센터", href: "/support" },
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
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 모바일: 사이드 메뉴 */}
      {isMobile ? (
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* 메뉴 헤더 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">메뉴</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="메뉴 닫기"
              >
                ×
              </button>
            </div>

            {/* 메뉴 아이템 */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FF7A00] hover:text-white transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 메뉴 푸터 */}
            <div className="p-6 border-t">
              <p className="text-sm text-gray-500 text-center">
                © 2025 Foundary
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 데스크탑: 드롭다운 메뉴 */
        isOpen && (
          <div className="absolute top-full left-0 mt-2 w-[220px] bg-[#FF7A00] rounded-lg shadow-xl z-50 py-2 ">
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-white    transition-colors font-medium"
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
