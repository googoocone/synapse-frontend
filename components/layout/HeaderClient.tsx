"use client";

import HeaderMenu from "@/components/layout/HeaderMenu";
import LogoutButton from "@/components/ui/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderClientProps {
    user: any;
}

export default function HeaderClient({ user }: HeaderClientProps) {
    const pathname = usePathname();
    const isLanding = pathname === "/";

    return (
        <header
            className={`fixed top-0 left-0 right-0 mx-auto z-20 w-full h-[50px] md:h-[60px] flex items-center justify-between px-4 sm:px-6 md:px-8 transition-colors duration-300 ${isLanding
                    ? "bg-white border-b border-gray-100"
                    : "max-w-[1200px] bg-[#ff5833] rounded-none md:rounded-md"
                }`}
        >
            {/* 왼쪽: 메뉴 + Foundary (모바일) */}
            <div className="flex items-center gap-2 md:flex-none md:w-auto">
                <HeaderMenu isLanding={isLanding} />

                {/* 모바일에서만 보이는 Foundary */}
                <Link href="/" className="md:hidden">
                    <span
                        className={`text-xl font-black ${isLanding ? "text-black" : "text-white"
                            }`}
                    >
                        Foundary
                    </span>
                </Link>
            </div>

            {/* 중앙: Foundary (데스크탑) */}
            <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/">
                    <span
                        className={`text-2xl md:text-[32px] font-black whitespace-nowrap ${isLanding ? "text-black" : "text-white"
                            }`}
                    >
                        Foundary
                    </span>
                </Link>
            </nav>

            {/* 오른쪽: 버튼들 */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 text-xs sm:text-sm">
                {user ? (
                    <>
                        <Link href="/subscription" className="hidden md:block">
                            <button
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${isLanding
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-black text-white hover:bg-[#214061]/80"
                                    }`}
                            >
                                구독하기
                            </button>
                        </Link>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        {/* 구독하기 버튼 - 데스크탑에서만 보임 */}
                        <Link href="/subscription" className=" md:block">
                            <button
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${isLanding
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-black text-white hover:bg-[#214061]/80"
                                    }`}
                            >
                                구독하기
                            </button>
                        </Link>
                        <Link href="/login">
                            <button
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${isLanding
                                        ? "bg-gray-100 text-black hover:bg-gray-200"
                                        : "bg-white text-black hover:bg-[#214061]/80 hover:text-white"
                                    }`}
                            >
                                로그인
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
