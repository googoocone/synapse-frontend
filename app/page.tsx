"use client";

import StoryCard from "@/components/home/FoundaryStory/Card";
import CategoryFilter from "@/components/home/FoundaryStory/CategoryFilter";
import NewFoundaryCard from "@/components/home/NewFoundarySection/NewFoundaryCard";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import cardImage1 from "@/assets/profile23.png";
import cardImage3 from "@/assets/profile24.png";
import cardImage2 from "@/assets/profile26.png";
import Link from "next/link";

const HomePage = () => {
  const supabase = createClient();

  const [stories, setStories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("전체");

  // ✅ 데이터 불러오기
  const fetchStories = async (category: string) => {
    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (category !== "전체") {
      // 1️⃣ tags가 문자열로 저장된 경우 ("커머스, 쇼핑몰")
      //    → LIKE 검색으로 포함된 경우 찾기
      query = query.contains("tags", [category]);
    }

    const { data, error } = await query;
    if (error) console.error("스토리 로딩 실패:", error);
    else setStories(data || []);
  };

  useEffect(() => {
    fetchStories(activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full  mx-auto  ">
      {/* --- 상단 섹션 --- */}
      <section className="flex flex-col lg:flex-row lg:justify-between gap-8 items-center mb-12 rounded-md  bg-white">
        <div className="w-full  flex flex-col items-center justify-center py-[32px]">
          <div className="text-[24px] font-semibold">
            '1인 창업가'를 위한 검증된 성공 공식
          </div>
          <div className="mt-[12px] text-[14px] font-semibold">
            Foundary에서 찾고, 만들고, 실행하세요
          </div>
          <div className="text-[14px] font-semibold">
            이미 성공한 "1인 창업가"들의 노하우를 구독하세요
          </div>
          <Link href="/login">
            <button className="mt-[32px] w-[380px] h-[50px] bg-black/90 text-white font-semibold rounded-md cursor-pointer">
              Foundary 가입하기
            </button>
          </Link>
        </div>
      </section>

      {/* NewFoundary 섹션 */}
      <section className="mt-12">
        <h2 className="text-[24px] font-bold flex gap-2 text-gray-900 mb-6">
          <p className="text-[#FF7A00]">New</p> Foundary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 카드 1 (Group 27.png) */}
          <NewFoundaryCard
            href="/stories/23"
            imageUrl={cardImage1} // (1)에서 import한 이미지
            category="아마존 구매대행"
            categoryStyle="bg-yellow-400 text-black" // 스크린샷의 노란색
            title="퇴사 2주 만에 월 1,000만원, 아마존 구매대행"
            tag="구매대행"
            amount="1,000만원"
          />

          {/* 카드 2 (스크린샷 참고) */}
          <NewFoundaryCard
            href="/stories/26"
            imageUrl={cardImage2} // (1)에서 import한 이미지
            category="노 코딩 홈페이지 제작"
            categoryStyle="bg-[#624AF1] text-white" // 스크린샷의 파란색
            title="템플릿+AI로 일주일에 300, 대학생 월 매출 2,000만 원 대학생"
            tag="지식창업"
            amount="2,000만원"
          />

          {/* 카드 3 (스크린샷 참고) */}
          <NewFoundaryCard
            href="/stories/24"
            imageUrl={cardImage3} // (1)에서 import한 이미지
            category="인플루언서 중개"
            categoryStyle="bg-red-600 text-white" // 스크린샷의 빨간색
            title="대리기사 관두고 인플루언서 공동구매 사업가로 "
            tag="마케팅"
            amount="2,000만원"
          />
        </div>
      </section>

      {/* --- 콘텐츠 섹션 --- */}
      <main className="my-12">
        <h2 className="text-[24px] font-bold flex gap-2 text-gray-900 mb-6">
          <p className="text-[#FF7A00]">Foundary</p> Story
        </h2>
        <div className="my-8">
          <CategoryFilter onCategoryChange={setActiveCategory} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stories.length > 0 ? (
            stories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              해당 카테고리에 스토리가 없습니다.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
