"use client";

import StoryCard from "@/components/home/Card";
import CategoryFilter from "@/components/home/CategoryFilter";
import ImageSlider from "@/components/home/ImageSlider";
import { createClient } from "@/utils/supabase/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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

      // 2️⃣ tags가 JSON 배열로 저장된 경우 ["커머스", "쇼핑몰"]
      //    → contains([])로 검색 가능
      // query = query.contains("tags", [category]);
    }

    const { data, error } = await query;
    if (error) console.error("스토리 로딩 실패:", error);
    else setStories(data || []);
  };

  useEffect(() => {
    fetchStories(activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* --- 상단 섹션 --- */}
      <section className="flex flex-col lg:flex-row lg:justify-between gap-8 items-center mb-12">
        <div className="flex flex-col space-y-6 w-full lg:w-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            성공이 필요한 순간, <br />
            국내 1인 창업의 성공 사례를 살펴보세요
          </h1>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="어떤 창업 사례를 찾으세요?"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
        </div>
        <div className="w-full sm:w-[370px] h-[300px] flex-shrink-0">
          <ImageSlider />
        </div>
      </section>

      {/* --- 콘텐츠 섹션 --- */}
      <main>
        <div className="mb-8">
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
