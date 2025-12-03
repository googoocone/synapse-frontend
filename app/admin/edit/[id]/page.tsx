"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@/components/admin/Editor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-8 text-center text-gray-400">
      에디터를 불러오는 중...
    </div>
  ),
});

const EditPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [founderImageUrl, setFounderImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [badges, setBadges] = useState("");
  const [metric, setMetric] = useState("");

  const [interviewContent, setInterviewContent] = useState<any>(null);
  const [guideContent, setGuideContent] = useState<any>(null);

  const [initialInterviewContent, setInitialInterviewContent] =
    useState<any>(null);
  const [initialGuideContent, setInitialGuideContent] = useState<any>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching story:", error);
      alert("스토리를 불러오는데 실패했습니다.");
      router.push("/admin/contents");
      return;
    }

    if (data) {
      setTitle(data.title);
      setImageUrl(data.image_url);
      setFounderImageUrl(data.founder_image_url || "");
      setTags(data.tags?.join(", ") || "");
      setBadges(data.badges?.join(", ") || "");
      setMetric(data.metric);

      setInitialInterviewContent(data.interview_content);
      setInitialGuideContent(data.guide_content);

      setInterviewContent(data.interview_content);
      setGuideContent(data.guide_content);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!title || !imageUrl) {
      setStatusMessage("제목과 이미지는 필수입니다.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("수정 중...");

    const storyData = {
      title,
      image_url: imageUrl,
      founder_image_url: founderImageUrl,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      badges: badges.split(",").map((badge) => badge.trim()).filter(Boolean),
      metric,
      interview_content: interviewContent,
      guide_content: guideContent,
      content: interviewContent,
    };

    const { error } = await supabase
      .from("stories")
      .update(storyData)
      .eq("id", id);

    if (error) {
      setStatusMessage(`수정 중 오류 발생: ${error.message}`);
      console.error(error);
      setIsSubmitting(false);
    } else {
      setStatusMessage("성공적으로 수정되었습니다!");
      router.push("/admin/contents");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">성공사례 수정</h1>
        <div className="flex items-center gap-4">
          {statusMessage && (
            <span className="text-sm text-gray-600">{statusMessage}</span>
          )}
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">기본 정보</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <ImageUpload
              label="대표 이미지"
              value={imageUrl}
              onChange={setImageUrl}
              bucketName="story_images"
            />

            <ImageUpload
              label="창업자 프로필 이미지 (선택)"
              value={founderImageUrl}
              onChange={setFounderImageUrl}
              bucketName="story_images"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                핵심 지표
              </label>
              <input
                type="text"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                태그 (쉼표 구분)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                뱃지 (쉼표 구분)
              </label>
              <input
                type="text"
                value={badges}
                onChange={(e) => setBadges(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              인터뷰 내용
            </h2>
            <div className="min-h-[400px]">
              <Editor
                onChange={setInterviewContent}
                initialContent={initialInterviewContent}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-full"></span>
              실전 가이드
            </h2>
            <div className="min-h-[400px]">
              <Editor
                onChange={setGuideContent}
                initialContent={initialGuideContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
