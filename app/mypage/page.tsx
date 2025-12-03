"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Card from "@/components/home/FoundaryStory/Card";

interface Subscription {
  id: string;
  status: string;
  started_at: string;
  expires_at: string;
  next_billing_date: string;
  cancelled_at?: string;
  subscription_plans: {
    name: string;
    price: number;
    duration_months: number;
  };
}

export default function MyPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [likedStories, setLikedStories] = useState<any[]>([]);
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setEmail(user.email || "");
      setName(user.user_metadata?.name || "");

      // 구독 정보 가져오기
      await fetchSubscription(user.id);

      // 찜한 스토리 가져오기
      await fetchLikedStories(user.id);

      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.log("구독 없음:", error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error("구독 조회 실패:", error);
    }
  };

  const fetchLikedStories = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("likes")
        .select(`
          story_id,
          stories (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("찜한 스토리 로딩 실패:", error);
        return;
      }

      if (data) {
        // likes 테이블에서 가져온 데이터 구조를 stories 배열로 변환
        const stories = data.map((item: any) => item.stories);
        setLikedStories(stories);
      }
    } catch (error) {
      console.error("찜한 스토리 조회 에러:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "정말 구독을 해지하시겠습니까?\n구독 만료일까지는 서비스를 계속 이용하실 수 있습니다."
      )
    ) {
      return;
    }

    setCancelling(true);

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "구독이 해지되었습니다.\n만료일까지는 서비스를 계속 이용하실 수 있습니다."
        );
        if (user) {
          await fetchSubscription(user.id);
        }
      } else {
        alert(data.error || "구독 해지에 실패했습니다.");
      }
    } catch (error) {
      console.error("구독 해지 에러:", error);
      alert("구독 해지 중 오류가 발생했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            활성
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
            <AlertCircle className="w-4 h-4" />
            해지 예정
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
            <XCircle className="w-4 h-4" />
            만료됨
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
    });
  };

  const getMembershipBadge = () => {
    if (!subscription) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          무료 사용자
        </span>
      );
    }

    if (subscription.status === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          유료 멤버십
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        무료 사용자
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-8">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        </div>

        {/* 회원 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            회원 정보
          </h2>

          {/* 프로필 이미지 */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div className="flex-1 space-y-4">
              {/* 이메일 */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p className="text-gray-900">{email}</p>
                </div>
              </div>

              {/* 이름 */}
              {name && (
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">이름</p>
                    <p className="text-gray-900">{name}</p>
                  </div>
                </div>
              )}

              {/* 멤버십 */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">멤버십</p>
                  {getMembershipBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="border-t pt-6 space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-white border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 구독 관리 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 transition-all duration-300">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsSubscriptionExpanded(!isSubscriptionExpanded)}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">구독 관리</h2>
              {subscription && getStatusBadge(subscription.status)}
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              {isSubscriptionExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {isSubscriptionExpanded && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
              {!subscription ? (
                // 구독 없음
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">활성화된 구독이 없습니다</p>
                  <button
                    onClick={() => router.push("/subscription")}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    구독하기
                  </button>
                </div>
              ) : (
                // 구독 있음
                <>
                  {/* 플랜 정보 */}
                  <div className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">현재 플랜</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscription.subscription_plans.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          ₩{subscription.subscription_plans.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {subscription.subscription_plans.duration_months === 1
                            ? "/ 월"
                            : "/ 년"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 구독 정보 */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">구독 시작일</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(subscription.started_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {subscription.status === "cancelled"
                            ? "만료 예정일"
                            : "다음 결제일"}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(
                            subscription.status === "cancelled"
                              ? subscription.expires_at
                              : subscription.next_billing_date
                          )}
                        </p>
                      </div>
                    </div>

                    {subscription.status === "cancelled" &&
                      subscription.cancelled_at && (
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">해지 신청일</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(subscription.cancelled_at)}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* 안내 메시지 */}
                  {subscription.status === "cancelled" ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>구독이 해지되었습니다.</strong>
                        <br />
                        {formatDate(subscription.expires_at)}까지 서비스를 이용하실
                        수 있습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>자동 갱신 안내</strong>
                        <br />
                        다음 결제일에 자동으로 결제됩니다. 구독을 해지하셔도 현재
                        구독 기간 만료일까지는 서비스를 이용하실 수 있습니다.
                      </p>
                    </div>
                  )}

                  {/* 버튼 */}
                  <div className="space-y-2">
                    {subscription.status === "active" && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelling ? "처리 중..." : "구독 해지하기"}
                      </button>
                    )}

                    {subscription.status === "cancelled" && (
                      <button
                        onClick={() => router.push("/subscription")}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        다시 구독하기
                      </button>
                    )}

                    <button
                      onClick={() => router.push("/payment-history")}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      결제 내역 보기
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 찜한 스토리 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            찜한 스토리
          </h2>

          {likedStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedStories.map((story) => (
                <div key={story.id} className="h-[420px]">
                  <Card story={story} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>아직 찜한 스토리가 없습니다.</p>
              <Link href="/home">
                <button className="mt-4 text-[#ff5833] font-medium hover:underline">
                  스토리 보러가기
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
