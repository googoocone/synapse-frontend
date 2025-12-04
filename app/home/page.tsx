"use client";

import StoryCard from "@/components/home/FoundaryStory/Card";
import CategoryFilter from "@/components/home/FoundaryStory/CategoryFilter";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState, useCallback } from "react";

import Link from "next/link";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const supabase = createClient();

  const [stories, setStories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchStories = useCallback(async (pageNumber: number, category: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let query = supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false })
        .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

      if (category !== "전체") {
        query = query.contains("tags", [category]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("스토리 로딩 실패:", error);
      } else {
        if (data) {
          if (data.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }

          setStories((prev) => {
            if (pageNumber === 0) return data;
            // 중복 제거 (혹시 모를 경우 대비)
            const newStories = data.filter(
              (newStory) => !prev.some((existing) => existing.id === newStory.id)
            );
            return [...prev, ...newStories];
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []); // 의존성 배열 비움 (isLoading 등은 ref로 관리하거나 함수형 업데이트 사용 권장되지만, 여기선 간단히 처리)

  // 카테고리 변경 시 초기화
  useEffect(() => {
    setStories([]);
    setPage(0);
    setHasMore(true);
    fetchStories(0, activeCategory);
  }, [activeCategory]);

  // 페이지 변경 시 추가 로드
  useEffect(() => {
    if (page > 0) {
      fetchStories(page, activeCategory);
    }
  }, [page]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);



  return (
    <div className="w-full mx-auto max-w-[1200px] px-4">
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
            <button className="mt-6 px-2 sm:px-12 md:mt-8 w-full max-w-[380px] h-12 md:h-[50px] bg-[#ff5833] text-white font-semibold rounded-md cursor-pointer hover:bg-[#ff5833]/80 transition-colors text-xs  sm:text-sm md:text-base">
              Foundary 가입하기
            </button>
          </Link>
        </div>
      </section>

      {/* --- 콘텐츠 섹션 --- */}
      <main className="my-8 md:my-12">
        <h2 className="text-xl md:text-2xl font-bold flex gap-2 text-gray-900 mb-4 md:mb-6 justify-center">
          <p className="text-[#ff5833]">Foundary</p> Story
        </h2>
        <div className="my-6 md:my-8 overflow-x-auto">
          <CategoryFilter onCategoryChange={setActiveCategory} />
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {stories.length > 0 ? (
              stories.map((story) => <StoryCard key={story.id} story={story} />)
            ) : (
              !isLoading && (
                <p className="col-span-full text-center text-gray-500 py-8">
                  해당 카테고리에 스토리가 없습니다.
                </p>
              )
            )}
          </div>
        </div>

        {/* 무한 스크롤 감지용 Sentinel */}
        {hasMore && (
          <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-8">
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default HomePage;
