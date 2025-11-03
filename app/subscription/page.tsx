// app/subscription/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );

  return (
    <div className="min-h-screen bg-white rounded-md py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <button className="text-purple-600 font-bold text-lg border-b-2 border-purple-600 pb-2">
              Foundary 멤버십
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  모든 성공 공식 컨텐츠를
                  <br />
                  무제한으로 즐겨보세요!
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  일주일 무료체험 후의 요금제를 선택하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 요금제 선택 */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            1인 멤버십
          </h2>

          {/* 12개월 플랜 (추천) */}
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === "yearly"
                ? "border-2 border-orange-500 shadow-lg"
                : "border-2 border-gray-200"
            }`}
          >
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                인기
              </span>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                58% 할인
              </span>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  12개월
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 line-through text-sm md:text-base">
                  ₩234,000
                </p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  ₩98,000
                </p>
                <p className="text-gray-500 text-sm md:text-base">₩8,167/월</p>
              </div>
            </div>
          </div>

          {/* 1개월 플랜 */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`bg-white rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-2 border-orange-500 shadow-lg"
                : "border-2 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-400">
                  1개월
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-bold text-gray-400">
                  ₩19,500
                  <span className="text-base md:text-lg">/월</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 구독 버튼 */}
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg md:text-xl font-bold py-4 md:py-5 rounded-2xl transition-colors mb-6">
          일주일간 무료 체험 시작하기
        </button>

        {/* 안내 문구 */}
        <p className="text-center text-gray-500 text-sm mb-8">
          애플 앱스토어에서 언제든지 취소할 수 있어요.
        </p>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-4 text-sm text-gray-500 mb-12">
          <Link href="/terms" className="hover:text-gray-700">
            이용 약관
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-gray-700">
            개인 정보 처리 방침
          </Link>
          <span>|</span>
          <Link href="/support" className="hover:text-gray-700 underline">
            고객센터
          </Link>
        </div>

        {/* 환불 정책 */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            환불 정책
          </h3>
          <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
            <p>• 결제 후 3일 이내에는 무조건 환불이 가능합니다.</p>
            <p>
              • 환불을 원하시면 고객센터(카카오톡 채널)로 연락주세요. 최대한
              빠르게 처리해드립니다.
            </p>
            <p className="text-gray-500 text-xs md:text-sm pt-2">
              * 콘텐츠 이용 여부와 관계없이 결제일로부터 72시간(3일) 이후에는
              환불이 불가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
