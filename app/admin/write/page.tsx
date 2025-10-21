"use client";

import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic"; // 1. next/dynamic을 import 합니다.
import { useState } from "react";

// 2. Editor 컴포넌트를 Dynamic Import로 불러옵니다.
//    ssr: false 옵션이 핵심입니다!
const Editor = dynamic(() => import("@/components/admin/Editor"), {
  ssr: false,
  // (선택사항) 에디터가 로드되는 동안 보여줄 UI
  loading: () => (
    <div className="border rounded-lg p-8 text-center text-gray-400">
      에디터를 불러오는 중...
    </div>
  ),
});

const WritePage = () => {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [badges, setBadges] = useState("");
  const [metric, setMetric] = useState("");
  const [content, setContent] = useState("");

  const [statusMessage, setStatusMessage] = useState("");

  const handleSave = async () => {
    const storyData = {
      title,
      image_url: imageUrl,
      tags: tags.split(",").map((tag) => tag.trim()),
      badges: badges.split(",").map((badge) => badge.trim()),
      metric,
      content,
      created_at: new Date(),
    };

    const { error } = await supabase.from("stories").insert([storyData]);

    if (error) {
      setStatusMessage(`저장 중 오류 발생: ${error.message}`);
      console.error(error);
    } else {
      setStatusMessage("성공적으로 저장되었습니다!");
      // ...필드 초기화 로직...
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">새 성공사례 작성</h1>

      <div className="space-y-6">
        {/* 기본 정보 입력 필드 */}
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

        {/* BlockNote 에디터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            본문 내용
          </label>
          <Editor onChange={setContent} initialContent={""} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end">
        {statusMessage && (
          <p className="mr-4 text-sm text-gray-600">{statusMessage}</p>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default WritePage;
