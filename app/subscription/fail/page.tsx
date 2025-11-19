"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// 실제 컴포넌트 (useSearchParams 사용)
function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "결제에 실패했습니다.";
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-4">{message}</p>
          {code && <p className="text-sm text-gray-500">에러 코드: {code}</p>}
        </div>

        <div className="space-y-3">
          <Link
            href="/subscription"
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">문제가 계속되시나요?</p>
          <Link
            href="/support"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            고객센터 문의하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 (Suspense로 감싸기)
export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
