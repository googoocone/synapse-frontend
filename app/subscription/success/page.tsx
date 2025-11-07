"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // URL에서 파라미터 가져오기
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const planName = searchParams.get("planName");

  useEffect(() => {
    // 5초 후 홈으로 자동 이동
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 성공 아이콘 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            구독이 완료되었습니다! 🎉
          </h1>
          <p className="text-gray-600">
            Foundary 멤버십에 오신 것을 환영합니다
          </p>
        </div>

        {/* 구독 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">구독 정보</h2>

          <div className="space-y-3">
            {planName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">플랜</span>
                <span className="font-semibold text-gray-900">{planName}</span>
              </div>
            )}

            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">결제 금액</span>
                <span className="font-semibold text-gray-900">
                  {parseInt(amount).toLocaleString()}원
                </span>
              </div>
            )}

            {orderId && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">주문번호</span>
                <span className="text-gray-700 font-mono">{orderId}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              다음 결제일에 자동으로 결제됩니다.
            </p>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            💡 <strong>알림:</strong> 구독 관리는 마이페이지에서 할 수 있습니다.
            언제든지 구독을 해지하거나 플랜을 변경할 수 있어요.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            홈으로 가기
          </button>

          <button
            onClick={() => router.push("/mypage")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border-2 border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            마이페이지로 이동
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* 자동 이동 카운트다운 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {countdown}초 후 자동으로 홈으로 이동합니다
        </p>
      </div>
    </div>
  );
}
