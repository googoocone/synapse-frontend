"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 실제 컴포넌트 (useSearchParams 사용)
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const customerName = searchParams.get("customerName");

  useEffect(() => {
    // 결제 성공 후 서버에 결제 정보 저장 등의 처리
    // TODO: API 호출
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h1>
          <p className="text-gray-600 mb-4">Foundary 멤버십에 가입되었습니다</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          {customerName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">구매자</span>
              <span className="font-medium">{customerName}</span>
            </div>
          )}
          {amount && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-bold text-orange-600">
                ₩{Number(amount).toLocaleString()}
              </span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">주문 번호</span>
              <span className="font-mono text-xs">{orderId}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            홈으로 가기
          </Link>
          <Link
            href="/my-account"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            내 계정 보기
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            🎁 1개월 무료 체험이 시작되었습니다
          </p>
          <p className="text-xs text-gray-500 mt-2">
            무료 기간 종료 3일 전에 알려드릴게요
          </p>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 (Suspense로 감싸기)
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">결제 확인 중...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
