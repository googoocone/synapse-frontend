import BlockNoteRenderer from "@/components/BlockNoteRenderer";
import { createClient } from "@/utils/supabase/server";
import { Badge, Calendar, Edit, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// TypeScript 타입을 정의합니다.
type Props = {
  params: { id: string };
};

// 페이지 메타데이터를 동적으로 생성합니다.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { id } = await params;

  const { data: story } = await supabase
    .from("stories")
    .select("title, tags")
    .eq("id", id)
    .single();

  if (!story) {
    return { title: "스토리를 찾을 수 없음" };
  }

  return {
    title: `${story.title} | 성공사례`,
    description: `1인 창업 성공사례: ${story.title}`,
    keywords: story.tags?.join(", "),
  };
}

// 상세 페이지 컴포넌트
const StoryDetailPage = async ({ params }: Props) => {
  const supabase = createClient();
  const { id } = params;

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) {
    notFound();
  }

  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 관리자 권한 확인
  const isAdmin = user?.email === "iycjdi0501@gmail.com";

  return (
    <div className="bg-gray-100">
      <div className="relative w-full h-64 md:h-96 bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${story.image_url})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative pb-16">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
          <header className="mb-8">
            {/* 편집 버튼 - 관리자만 보임 */}
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <Link href={`/admin/edit/${story.id}`}>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                    <Edit size={16} />
                    편집하기
                  </button>
                </Link>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {story.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1.5" />
                <span>{new Date(story.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Tag size={14} className="mr-1.5" />
                <span>{story.tags?.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <Badge size={14} className="mr-1.5" />
                <span>{story.badges?.join(", ")}</span>
              </div>
            </div>
            <div className="mt-6 border-t pt-6">
              <p className="text-lg font-bold text-gray-800">
                핵심 성과: <span className="text-blue-600">{story.metric}</span>
              </p>
            </div>
          </header>

          <article className="prose prose-lg max-w-none">
            <BlockNoteRenderer content={story.content} />
          </article>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
