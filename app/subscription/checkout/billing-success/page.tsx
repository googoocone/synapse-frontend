"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processBilling = async () => {
      try {
        // URL에서 파라미터 가져오기
        const authKey = searchParams.get("authKey");
        const customerKey = searchParams.get("customerKey");
        const plan = searchParams.get("plan");

        if (!authKey || !customerKey) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        // 플랜 ID 매핑
        const planId =
          plan === "monthly"
            ? "019c60d5-4a73-42de-a2dd-fb1d19e121df"
            : "7d71fcc3-8b9b-4abc-8e9f-178ff988ce47";

        // 빌링키 발급 API 호출
        const response = await fetch("/api/subscription/billing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authKey,
            customerKey,
            planId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "결제 처리에 실패했습니다.");
        }

        // 성공 페이지로 이동
        const queryParams = new URLSearchParams({
          orderId: data.payment.orderId,
          amount: data.payment.totalAmount.toString(),
          planName:
            data.subscription.plan_id === "yearly_plan_id"
              ? "12개월 플랜"
              : "1개월 플랜",
        });

        router.push(`/subscription/success?${queryParams.toString()}`);
      } catch (error: any) {
        console.error("빌링 처리 에러:", error);
        setError(error.message);

        // 실패 페이지로 이동
        setTimeout(() => {
          router.push(
            `/subscription/fail?message=${encodeURIComponent(error.message)}`
          );
        }, 2000);
      }
    };

    processBilling();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <p className="text-gray-900 font-semibold mb-2">결제 처리 실패</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <p className="text-gray-500 text-sm mt-4">
            잠시 후 실패 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-900 font-semibold mb-2">결제 처리 중...</p>
        <p className="text-gray-600 text-sm">
          잠시만 기다려주세요. 결제를 처리하고 있습니다.
        </p>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}
