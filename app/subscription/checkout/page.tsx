"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "yearly";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 플랜 정보
  const plans = {
    monthly: {
      id: "019c60d5-4a73-42de-a2dd-fb1d19e121df",
      name: "1개월 플랜",
      price: 19500,
      period: "월간",
      billingCycle: "monthly",
    },
    yearly: {
      id: "7d71fcc3-8b9b-4abc-8e9f-178ff988ce47",
      name: "12개월 플랜",
      price: 98000,
      period: "연간",
      originalPrice: 234000,
      discount: "58%",
      billingCycle: "yearly",
    },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handlePayment = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 환경 변수 체크
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      alert(
        "토스 페이먼츠 클라이언트 키가 설정되지 않았습니다. 관리자에게 문의해주세요."
      );
      console.error("NEXT_PUBLIC_TOSS_CLIENT_KEY is not defined");
      return;
    }

    setProcessing(true);

    try {
      // 1. 토스 페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(clientKey);

      // 2. 고객 키 생성 (사용자 ID 기반)
      const customerKey = `customer_${user.id}`;

      // 3. 빌링키 발급 요청
      const billingKeyResponse = await tossPayments.requestBillingAuth("카드", {
        customerKey,
        successUrl: `${window.location.origin}/subscription/checkout/billing-success?plan=${selectedPlan}`,
        failUrl: `${window.location.origin}/subscription/fail`,
      });

      console.log("빌링키 발급 요청:", billingKeyResponse);
    } catch (error: any) {
      console.error("결제 에러:", error);
      alert(error.message || "결제 처리 중 오류가 발생했습니다.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">구독 결제</h1>
          <p className="text-gray-600">
            안전한 결제를 위해 카드 정보를 등록해주세요
          </p>
        </div>

        {/* 선택한 플랜 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">선택한 플랜</h2>
            {selectedPlan === "yearly" && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {currentPlan.discount} 할인
              </span>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">{currentPlan.name}</span>
              <span className="font-semibold text-gray-900">
                {currentPlan.period}
              </span>
            </div>

            {selectedPlan === "yearly" && currentPlan.originalPrice && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm">정가</span>
                <span className="text-gray-400 line-through text-sm">
                  ₩{currentPlan.originalPrice.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3 mt-3">
              <span className="text-gray-900">총 결제 금액</span>
              <span className="text-orange-600">
                ₩{currentPlan.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 결제 혜택 */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">구독 혜택</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  모든 콘텐츠 무제한 이용
                </p>
                <p className="text-sm text-gray-600">
                  1인 창업 성공 공식 전체 콘텐츠
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  신규 콘텐츠 우선 제공
                </p>
                <p className="text-sm text-gray-600">
                  매주 업데이트되는 최신 콘텐츠
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">언제든지 해지 가능</p>
                <p className="text-sm text-gray-600">
                  해지 후에도 구독 기간까지 이용 가능
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">결제 정보</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 구독 시 즉시 결제가 진행됩니다.</p>
            <p>• 결제 후 3일 이내 전액 환불이 가능합니다.</p>
            <p>• 다음 결제일에 자동으로 갱신됩니다.</p>
          </div>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              처리 중...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              안전하게 결제하기
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Shield className="w-4 h-4 inline mr-1" />
          토스페이먼츠의 안전한 결제 시스템을 이용합니다
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
