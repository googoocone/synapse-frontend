"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    CreditCard,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowRight,
} from "lucide-react";

interface Subscription {
    id: string;
    status: string;
    plan_id: string;
    started_at: string;
    expires_at: string;
    next_billing_date: string;
    cancel_at_period_end: boolean;
    scheduled_plan_id: string | null;
    subscription_plans: {
        name: string;
        price: number;
        billing_cycle: string;
    };
}

export default function SubscriptionManagePage() {
    const router = useRouter();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("subscriptions")
            .select("*, subscription_plans(*)")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("구독 정보 조회 실패:", error);
        }

        setSubscription(data);
        setLoading(false);
    };

    const handleCancel = async () => {
        if (!subscription) return;

        const startedAt = new Date(subscription.started_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isWithin3Days = diffDays <= 3;

        let confirmMessage = "정말로 구독을 해지하시겠습니까?";
        if (isWithin3Days) {
            confirmMessage =
                "가입 후 3일 이내 해지 시 수수료 5%를 제외한 금액이 환불됩니다. 계속하시겠습니까?";
        } else {
            confirmMessage =
                "해지하더라도 남은 기간 동안은 서비스를 계속 이용하실 수 있습니다. 다음 결제일부터 자동 결제가 중단됩니다.";
        }

        if (!confirm(confirmMessage)) return;

        setProcessing(true);

        try {
            const response = await fetch("/api/subscription/cancel", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "해지 처리에 실패했습니다.");
            }

            alert(data.message);
            fetchSubscription(); // 정보 갱신
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleChangePlan = async (newPlanId: string) => {
        if (!confirm("플랜을 변경하시겠습니까? 다음 결제일부터 적용됩니다.")) return;

        setProcessing(true);

        try {
            const response = await fetch("/api/subscription/change-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPlanId }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "플랜 변경에 실패했습니다.");
            }

            alert(data.message);
            fetchSubscription();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        구독 정보가 없습니다
                    </h1>
                    <p className="text-gray-600 mb-8">
                        현재 이용 중인 멤버십이 없습니다.
                    </p>
                    <button
                        onClick={() => router.push("/subscription")}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        멤버십 가입하기
                    </button>
                </div>
            </div>
        );
    }

    const isYearly = subscription.subscription_plans.billing_cycle === "yearly";
    const monthlyPlanId = "019c60d5-4a73-42de-a2dd-fb1d19e121df"; // DB ID 확인 필요
    const yearlyPlanId = "7d71fcc3-8b9b-4abc-8e9f-178ff988ce47"; // DB ID 확인 필요

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">구독 관리</h1>

                {/* 현재 구독 정보 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {subscription.subscription_plans.name}
                                </h2>
                                <p className="text-gray-500">
                                    {isYearly ? "연간 결제" : "월간 결제"} • ₩
                                    {subscription.subscription_plans.price.toLocaleString()}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${subscription.cancel_at_period_end
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                            >
                                {subscription.cancel_at_period_end ? "해지 예약됨" : "이용 중"}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span>
                                다음 결제일:{" "}
                                <span className="font-medium text-gray-900">
                                    {new Date(subscription.next_billing_date).toLocaleDateString()}
                                </span>
                            </span>
                        </div>
                        {subscription.scheduled_plan_id && (
                            <div className="flex items-center gap-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span>
                                    다음 결제일부터{" "}
                                    {subscription.scheduled_plan_id === yearlyPlanId
                                        ? "12개월 플랜"
                                        : "1개월 플랜"}
                                    으로 변경됩니다.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 플랜 변경 */}
                {!subscription.cancel_at_period_end && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">플랜 변경</h3>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-500 transition-colors cursor-pointer group">
                            <div>
                                <p className="font-bold text-gray-900">
                                    {isYearly ? "1개월 플랜으로 변경" : "12개월 플랜으로 변경"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isYearly
                                        ? "다음 결제일부터 월간 결제로 전환됩니다."
                                        : "다음 결제일부터 연간 결제로 전환됩니다 (58% 할인)."}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    handleChangePlan(isYearly ? monthlyPlanId : yearlyPlanId)
                                }
                                disabled={processing}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 transition-all font-medium"
                            >
                                변경하기
                            </button>
                        </div>
                    </div>
                )}

                {/* 구독 해지 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">구독 해지</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        구독을 해지하시겠습니까? 해지하더라도 남은 기간 동안은 서비스를 계속
                        이용하실 수 있습니다.
                    </p>

                    {subscription.cancel_at_period_end ? (
                        <button
                            disabled
                            className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed"
                        >
                            해지 예약됨
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            disabled={processing}
                            className="w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold transition-colors"
                        >
                            구독 해지하기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
