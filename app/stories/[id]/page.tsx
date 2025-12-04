import StoryHeader from "@/components/stories/StoryHeader";
import StoryDetailTabs from "./StoryDetailTabs";

import { createClient } from "@/utils/supabase/server";
import { Badge, Calendar, Edit, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
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

const StoryDetailPage = async ({ params }: Props) => {
  const supabase = await createClient();
  const { id } = await params;

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email === "snu910501@naver.com";
  const isLoggedIn = !!user;

  return (
    <div className="bg-white">
      {/* 상단 히어로 이미지 */}
      <div className="relative w-full h-64 md:h-96 bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${story.image_url})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-5xl mx-auto mt-2 relative pb-16">
        <div className="bg-white p-6 md:p-10">
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

          <StoryHeader story={story} />

          {/* 👇 여기부터 탭 영역 */}
          <article className="max-w-none">
            <StoryDetailTabs
              interviewContent={story.interview_content}
              guideContent={story.guide_content}
              isLoggedIn={isLoggedIn}
            />
          </article>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
