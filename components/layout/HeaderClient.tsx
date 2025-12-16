"use client";

import HeaderMenu from "@/components/layout/HeaderMenu";
import LogoutButton from "@/components/ui/LogoutButton";
import Link from "next/link";

interface HeaderClientProps {
    user: any;
}

export default function HeaderClient({ user }: HeaderClientProps) {
    return (
        <header className="fixed top-0 left-0 right-0 mx-auto z-20 w-full h-[50px] md:h-[60px] flex items-center justify-between px-4 sm:px-6 md:px-8 transition-colors duration-300 bg-white border-b border-gray-100">
            {/* 왼쪽: 메뉴 + Foundary (모바일) */}
            <div className="flex items-center gap-2 md:flex-none md:w-auto">
                <HeaderMenu isLanding={true} />

                {/* 모바일에서만 보이는 Foundary */}
                <Link href={user ? "/home" : "/"} className="md:hidden">
                    <span className="text-xl font-black text-[#ff5833]">Foundary</span>
                </Link>
            </div>

            {/* 중앙: Foundary (데스크탑) */}
            <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href={user ? "/home" : "/"}>
                    <span className="text-2xl md:text-[32px] font-black whitespace-nowrap text-[#ff5833]">
                        Foundary
                    </span>
                </Link>
            </nav>

            {/* 오른쪽: 버튼들 */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 text-xs sm:text-sm">
                {user ? (
                    <>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap bg-gray-100 text-black hover:bg-gray-200">
                                로그인
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
