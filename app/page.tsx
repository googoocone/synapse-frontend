import StoryCard from "@/components/home/Card";
import CategoryFilter from "@/components/home/CategoryFilter";
import ImageSlider from "@/components/home/ImageSlider";
import { createClient } from "@/utils/supabase/server"; // 1. 서버용 Supabase 클라이언트를 import 합니다.
import { Search } from "lucide-react";

// 2. HomePage 컴포넌트를 async 함수로 변경합니다.
const HomePage = async () => {
  const supabase = createClient();

  // 3. Supabase에서 'stories' 테이블의 데이터를 불러옵니다.
  //    최신 글이 위로 오도록 정렬합니다.
  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  // 데이터 로딩 중 에러가 발생하면 콘솔에 로그를 남깁니다.
  if (error) {
    console.error("스토리 데이터 로딩 실패:", error);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* --- 상단 히어로 섹션 --- */}
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
        {/* 카테고리 필터 */}
        <div className="mb-8">
          <CategoryFilter />
        </div>

        {/* 성공 사례 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 4. mockStories 대신 서버에서 받아온 stories 데이터로 카드를 렌더링합니다. */}
          {stories?.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
