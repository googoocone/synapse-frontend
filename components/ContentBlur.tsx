"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ContentBlurProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
  previewPercentage?: number; // 전체 콘텐츠 중 몇 %를 보여줄지 (기본 60%)
}

export default function ContentBlur({
  isLoggedIn,
  children,
  previewPercentage = 40,
}: ContentBlurProps) {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [previewHeight, setPreviewHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn && contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight;
      setContentHeight(fullHeight);
      setPreviewHeight((fullHeight * previewPercentage) / 100);
    }
  }, [isLoggedIn, previewPercentage]);

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* 콘텐츠 컨테이너 */}
      <div
        ref={contentRef}
        style={{ maxHeight: previewHeight || "auto" }}
        className="overflow-hidden relative"
      >
        {children}

        {/* 하단 blur 그라데이션 */}
        {contentHeight > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* CTA 섹션 */}
      {contentHeight > 0 && (
        <div className="mt-8 py-12 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2 px-4">
            <p className="text-2xl font-bold text-gray-900">
              아직 {100 - previewPercentage}%가 더 남았어요! 🚀
            </p>
            <p className="text-gray-600">
              이 성공사례의 구체적인 노하우와 누구나 쉽게 따라할 수 있는
              액션플랜을 확인하세요
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/login">
              <button className="px-8 py-4 bg-[#FF7A00] text-white font-bold rounded-lg hover:bg-[#FF7A00]/90 transition-colors shadow-lg text-lg">
                무료 가입하고 전체 내용 보기 →
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>완전 무료</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>1분만에 가입</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>모든 스토리 열람</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 pt-4">
            이미 회원이신가요?{" "}
            <Link
              href="/login"
              className="text-[#FF7A00] hover:underline font-semibold"
            >
              로그인하기
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
