"use client";

import Link from "next/link";

const LoginRequestOverlay = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center z-10 p-4 ${className}`}>
            <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-lg w-full text-center text-white">
                <h3 className="text-lg md:text-xl font-bold mb-2">
                    다음 내용이 궁금하신가요?
                </h3>
                <p className="text-gray-300 mb-8 text-sm md:text-base">
                    무료 회원가입으로 모든 콘텐츠를 제한 없이 만나보세요.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="block w-full bg-[#ff5833] hover:bg-[#e04e2e] text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        3초 만에 회원가입하고 전체 보기
                    </Link>

                    <div className="text-sm text-gray-400">
                        이미 가입했다면{" "}
                        <Link href="/login" className="text-white underline hover:text-gray-200">
                            로그인하기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRequestOverlay;
