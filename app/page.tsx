"use client";

import StoryCard from "@/components/home/FoundaryStory/Card";
import CategoryFilter from "@/components/home/FoundaryStory/CategoryFilter";
import NewFoundaryCard from "@/components/home/NewFoundarySection/NewFoundaryCard";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import cardImage1 from "@/assets/profile23.png";
import cardImage3 from "@/assets/profile24.png";
import cardImage2 from "@/assets/profile26.png";

// Swiper import
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const HomePage = () => {
  const supabase = createClient();

  const [stories, setStories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("전체");

  const fetchStories = async (category: string) => {
    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (category !== "전체") {
      query = query.contains("tags", [category]);
    }

    const { data, error } = await query;
    if (error) console.error("스토리 로딩 실패:", error);
    else setStories(data || []);
  };

  useEffect(() => {
    fetchStories(activeCategory);
  }, [activeCategory]);

  const newFoundaryCards = [
    {
      href: "/stories/33",
      imageUrl: cardImage1,
      category: "아마존 구매대행",
      categoryStyle: "bg-yellow-400 text-black",
      title: "반영구샵+구매대행 병행, 월 매출 1억 2천→순수익 4천만 원",
      tag: "구매대행",
      amount: "4,000만원",
    },
    {
      href: "/stories/26",
      imageUrl: cardImage2,
      category: "노 코딩 홈페이지 제작",
      categoryStyle: "bg-[#624AF1] text-white",
      title: "템플릿+AI로 일주일에 300, 대학생 월 매출 2,000만 원 대학생",
      tag: "지식창업",
      amount: "2,000만원",
    },
    {
      href: "/stories/24",
      imageUrl: cardImage3,
      category: "인플루언서 중개",
      categoryStyle: "bg-red-600 text-white",
      title: "대리기사 관두고 인플루언서 공동구매 사업가로 ",
      tag: "마케팅",
      amount: "2,000만원",
    },
  ];

  return (
    <div className="w-full mx-auto">
      {/* --- 상단 섹션 --- */}
      <section className="flex flex-col lg:flex-row lg:justify-between gap-8 items-center mb-8 md:mb-12 rounded-md bg-white">
        <div className="w-full flex flex-col items-center justify-center py-6 md:py-8 lg:py-10 px-4">
          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            '1인 창업가'를 위한 검증된 성공 공식
          </div>
          <div className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base font-semibold text-center">
            Foundary에서 찾고, 만들고, 실행하세요
          </div>
          <div className="text-xs sm:text-sm md:text-base font-semibold text-center">
            이미 성공한 "1인 창업가"들의 노하우를 구독하세요
          </div>
          <Link href="/login">
            <button className="mt-6 px-2 sm:px-12 md:mt-8 w-full max-w-[380px] h-12 md:h-[50px] bg-black/90 text-white font-semibold rounded-md cursor-pointer hover:bg-black transition-colors text-xs  sm:text-sm md:text-base">
              Foundary 가입하기
            </button>
          </Link>
        </div>
      </section>

      {/* NewFoundary 섹션 */}
      <section className="mt-8 md:mt-12">
        <h2 className="text-xl md:text-2xl font-bold flex gap-2 text-gray-900 mb-4 md:mb-6 justify-center">
          <p className="text-[#FF7A00]">New</p> Foundary
        </h2>

        {/* 모바일/태블릿: Swiper */}
        <div className="block lg:hidden relative px-2">
          <div className="max-w-md mx-auto sm:max-w-2xl">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
              }}
              className="pb-12"
            >
              {newFoundaryCards.map((card, index) => (
                <SwiperSlide key={index}>
                  <NewFoundaryCard {...card} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* 데스크톱: Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-3">
          {newFoundaryCards.map((card, index) => (
            <NewFoundaryCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* --- 콘텐츠 섹션 --- */}
      <main className="my-8 md:my-12 px-2">
        <h2 className="text-xl md:text-2xl font-bold flex gap-2 text-gray-900 mb-4 md:mb-6 justify-center">
          <p className="text-[#FF7A00]">Foundary</p> Story
        </h2>
        <div className="my-6 md:my-8 overflow-x-auto">
          <CategoryFilter onCategoryChange={setActiveCategory} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {stories.length > 0 ? (
            stories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              해당 카테고리에 스토리가 없습니다.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
