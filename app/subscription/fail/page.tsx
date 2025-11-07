"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

export default function SubscriptionFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  // URL에서 에러 정보 가져오기
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  useEffect(() => {
    // 10초 후 구독 페이지로 자동 이동
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/subscription");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // 에러 메시지 한글화
  const getErrorMessage = () => {
    if (errorMessage) {
      return decodeURIComponent(errorMessage);
    }

    // 에러 코드별 기본 메시지
    switch (errorCode) {
      case "USER_CANCEL":
        return "사용자가 결제를 취소했습니다.";
      case "INVALID_CARD":
        return "유효하지 않은 카드입니다.";
      case "INSUFFICIENT_BALANCE":
        return "잔액이 부족합니다.";
      case "EXCEED_MAX_AMOUNT":
        return "결제 한도를 초과했습니다.";
      case "INVALID_API_KEY":
        return "API 키가 유효하지 않습니다.";
      default:
        return "결제 처리 중 오류가 발생했습니다.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 실패 아이콘 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-600">
            구독 결제가 정상적으로 처리되지 않았습니다
          </p>
        </div>

        {/* 에러 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">실패 사유</h2>

          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <p className="text-red-800">{getErrorMessage()}</p>
          </div>

          {errorCode && (
            <div className="text-sm text-gray-500">
              <span className="font-mono">오류 코드: {errorCode}</span>
            </div>
          )}
        </div>

        {/* 해결 방법 안내 */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">해결 방법</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 카드 정보를 다시 확인해주세요</li>
                <li>• 카드 한도 및 잔액을 확인해주세요</li>
                <li>• 다른 결제 수단을 시도해보세요</li>
                <li>• 문제가 지속되면 고객센터로 문의해주세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/subscription")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            다시 시도하기
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border-2 border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </button>
        </div>

        {/* 고객센터 안내 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">문제가 계속되시나요?</p>
          <a
            href="mailto:contact@foundary.kr"
            className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
          >
            고객센터 문의하기 →
          </a>
        </div>

        {/* 자동 이동 카운트다운 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {countdown}초 후 구독 페이지로 이동합니다
        </p>
      </div>
    </div>
  );
}
