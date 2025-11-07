"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PaymentHistory {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  order_id: string;
  created_at: string;
}

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error("결제 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            성공
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            실패
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            대기
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로가기
          </button>
          <h1 className="text-2xl font-bold text-gray-900">결제 내역</h1>
        </div>

        {/* 결제 내역 리스트 */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-500 mb-4">결제 내역이 없습니다</p>
            <button
              onClick={() => router.push("/subscription")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              구독하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Foundary 멤버십 결제
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>결제 수단: {payment.payment_method}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      주문번호: {payment.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₩{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 문의 안내 */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
          <p className="text-sm text-blue-800 mb-2">
            결제 관련 문의사항이 있으신가요?
          </p>
          <a
            href="mailto:contact@foundary.kr"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            contact@foundary.kr로 문의하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
