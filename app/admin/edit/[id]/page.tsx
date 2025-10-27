"use client";

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
  const storyId = params.id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [badges, setBadges] = useState("");
  const [metric, setMetric] = useState("");
  const [content, setContent] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();

      if (error) {
        console.error("데이터 로드 실패:", error);
        setStatusMessage("데이터를 불러올 수 없습니다.");
        return;
      }

      if (data) {
        setTitle(data.title || "");
        setImageUrl(data.image_url || "");
        setTags(data.tags ? data.tags.join(", ") : "");
        setBadges(data.badges ? data.badges.join(", ") : "");
        setMetric(data.metric || "");
        setContent(data.content || "");
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId, supabase]);

  const handleUpdate = async () => {
    const storyData = {
      title,
      image_url: imageUrl,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      badges: badges
        .split(",")
        .map((badge) => badge.trim())
        .filter((badge) => badge),
      metric,
      content,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from("stories")
      .update(storyData)
      .eq("id", storyId);

    if (error) {
      setStatusMessage(`수정 중 오류 발생: ${error.message}`);
      console.error(error);
    } else {
      setStatusMessage("성공적으로 수정되었습니다!");
      setTimeout(() => {
        router.push("/admin/stories"); // 목록 페이지로 이동
      }, 1500);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) {
      setStatusMessage(`삭제 중 오류 발생: ${error.message}`);
      console.error(error);
    } else {
      setStatusMessage("성공적으로 삭제되었습니다!");
      setTimeout(() => {
        router.push("/admin/stories");
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">성공사례 수정</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            대문 이미지 URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            태그 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="커머스, 콘텐츠 제작, 지식 창업"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            뱃지 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={badges}
            onChange={(e) => setBadges(e.target.value)}
            placeholder="소액창업, 어려움"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            핵심 지표
          </label>
          <input
            type="text"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            placeholder="월 1,000만원 매출"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            본문 내용
          </label>
          <Editor onChange={setContent} initialContent={content} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
        >
          삭제하기
        </button>

        <div className="flex items-center">
          {statusMessage && (
            <p className="mr-4 text-sm text-gray-600">{statusMessage}</p>
          )}
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
