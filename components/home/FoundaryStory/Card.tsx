"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Card = ({ story }: { story: any }) => {
  const supabase = createClient();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkLikeStatus();
  }, [story.id]);

  const checkLikeStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("story_id", story.id)
        .single();

      if (data) {
        setIsLiked(true);
      }
    }
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if (isLoading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
        router.push("/login");
      }
      return;
    }

    setIsLoading(true);

    // 낙관적 업데이트
    const previousState = isLiked;
    setIsLiked(!previousState);

    try {
      if (previousState) {
        // 이미 좋아요 상태 -> 취소
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("story_id", story.id);

        if (error) throw error;
      } else {
        // 좋아요 안 된 상태 -> 추가
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, story_id: story.id });

        if (error) throw error;
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      setIsLiked(previousState); // 롤백
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => router.push(`/stories/${story.id}`)}
      className="block group h-full cursor-pointer"
    >
      <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col relative">
        {/* Image Section */}
        <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${story.image_url})` }}
          />

          {/* Wish Button (Heart) */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={toggleLike}
              className={`w-8 h-8 flex items-center justify-center backdrop-blur-sm rounded-full transition-colors ${isLiked ? "bg-red-50 hover:bg-red-100" : "bg-black/20 hover:bg-red-500/20"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isLiked ? "#ff5833" : "none"}
                className={isLiked ? "text-[#ff5833]" : "text-white"}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                  fillOpacity={isLiked ? "1" : "0.8"}
                />
              </svg>
            </button>
          </div>

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <h3 className="text-[17px] font-bold text-gray-900 line-clamp-2 leading-snug min-h-[44px]">
              {story.title}
            </h3>

            {/* Badges / Keywords */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {story.badges?.map((badge: string, index: number) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <span className="mx-1.5 text-gray-300">|</span>}
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Footer: Price/Metric & Status */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-end justify-between">
            {/* 심사 기간 동안 숨김 처리 */}
            {/* <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 font-medium mb-0.5">월 매출</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-[#ff5833]">
                    {story.metric}
                  </span>
                </div>
              </div> */}
            <div className="flex flex-col">
            </div>

            {/* Founder Profile Image (Replaces NEW Badge) */}
            {story.founder_image_url && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden shadow-sm">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${story.founder_image_url})` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
