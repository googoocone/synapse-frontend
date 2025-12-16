"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [likedStories, setLikedStories] = useState<any[]>([]);

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

      // 찜한 스토리 가져오기
      await fetchLikedStories(user.id);

      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

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
