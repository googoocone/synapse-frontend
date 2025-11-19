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
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [badges, setBadges] = useState("");
  const [metric, setMetric] = useState("");

  // ✅ content 대신 인터뷰 / 가이드용 상태
  const [interviewContent, setInterviewContent] = useState<any>(null);
  const [guideContent, setGuideContent] = useState<any>(null);

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
        setLoading(false);
        return;
      }

      if (data) {
        setTitle(data.title || "");
        setImageUrl(data.image_url || "");
        setTags(data.tags ? data.tags.join(", ") : "");
        setBadges(data.badges ? data.badges.join(", ") : "");
        setMetric(data.metric || "");

        // ✅ 인터뷰/가이드 콘텐츠 초기화
        // interview_content가 없으면 옛날 content를 인터뷰로 사용해서 마이그레이션
        setInterviewContent(data.interview_content ?? data.content ?? null);
        setGuideContent(data.guide_content ?? null);

        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId, supabase]);

  // 에디터 내용 변경 핸들러들
  const handleInterviewChange = (newContent: any) => {
    setInterviewContent(newContent);
  };

  const handleGuideChange = (newContent: any) => {
    setGuideContent(newContent);
  };

  const handleUpdate = async () => {
    setSaving(true);
    setStatusMessage("");

    const storyData: any = {
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
      interview_content: interviewContent,
      guide_content: guideContent,
      updated_at: new Date().toISOString(),
    };

    // ✅ 구버전 호환 (원하면 유지)
    // content 컬럼도 계속 인터뷰 내용으로 맞춰두고 싶다면:
    storyData.content = interviewContent;

    console.log("Story data object:", {
      ...storyData,
      interview_content:
        interviewContent && JSON.stringify(interviewContent).length,
      guide_content: guideContent && JSON.stringify(guideContent).length,
    });

    const { data: beforeData } = await supabase
      .from("stories")
      .select("title, interview_content, guide_content, updated_at")
      .eq("id", storyId)
      .single();

    console.log("\n=== BEFORE UPDATE ===");
    console.log({
      title: beforeData?.title,
      interviewLength: beforeData?.interview_content
        ? JSON.stringify(beforeData.interview_content).length
        : 0,
      guideLength: beforeData?.guide_content
        ? JSON.stringify(beforeData.guide_content).length
        : 0,
      updated_at: beforeData?.updated_at,
    });

    const { data, error } = await supabase
      .from("stories")
      .update(storyData)
      .eq("id", storyId)
      .select();

    console.log("\n=== UPDATE RESPONSE ===");
    console.log("Response data:", data);
    console.log("Response error:", error);

    const { data: afterData } = await supabase
      .from("stories")
      .select("title, interview_content, guide_content, updated_at")
      .eq("id", storyId)
      .single();

    console.log("\n=== AFTER UPDATE ===");
    console.log({
      title: afterData?.title,
      interviewLength: afterData?.interview_content
        ? JSON.stringify(afterData.interview_content).length
        : 0,
      guideLength: afterData?.guide_content
        ? JSON.stringify(afterData.guide_content).length
        : 0,
      updated_at: afterData?.updated_at,
    });

    if (error) {
      setStatusMessage(`수정 중 오류 발생: ${error.message}`);
      console.error("Full error:", error);
      setSaving(false);
    } else {
      setStatusMessage("성공적으로 수정되었습니다!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) {
      setStatusMessage(`삭제 중 오류 발생: ${error.message}`);
      console.error(error);
      setSaving(false);
    } else {
      setStatusMessage("성공적으로 삭제되었습니다!");
      setTimeout(() => {
        router.push("/");
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

  const interviewLength = interviewContent
    ? JSON.stringify(interviewContent).length
    : 0;
  const guideLength = guideContent ? JSON.stringify(guideContent).length : 0;

  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-3xl font-bold mb-8">
          성공사례 수정 (인터뷰 / 실전 가이드)
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              className="w-full p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-full p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-full p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-full p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-full p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* ✅ 인터뷰 에디터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              인터뷰 내용 (창업자 스토리)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              실제 경험담, 마인드, 과정 중심의 스토리를 작성해주세요.
            </p>
            <Editor
              onChange={handleInterviewChange}
              initialContent={interviewContent}
              key={`${storyId}-interview`}
            />
          </div>

          {/* ✅ 실전 가이드 에디터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-6">
              실전 가이드 내용 (따라하기용 가이드)
            </label>
            <p className="text-xs text-gray-400 mb-2">
              독자가 그대로 따라 할 수 있도록 단계/체크리스트/툴/주의사항
              중심으로 작성해주세요.
            </p>
            <Editor
              onChange={handleGuideChange}
              initialContent={guideContent}
              key={`${storyId}-guide`}
            />
          </div>

          {/* 디버그 정보 */}
          <div className="p-4 bg-blue-50 rounded text-sm space-y-1">
            <div>
              <strong>디버그 정보:</strong>
            </div>
            <div>Story ID: {String(storyId)}</div>
            <div>인터뷰 content 길이: {interviewLength} chars</div>
            <div>실전 가이드 content 길이: {guideLength} chars</div>
            <div>Title: {title}</div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            삭제하기
          </button>

          <div className="flex items-center gap-4">
            {statusMessage && (
              <p
                className={`text-sm ${
                  statusMessage.includes("오류")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {statusMessage}
              </p>
            )}
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  저장 중...
                </>
              ) : (
                "수정하기"
              )}
            </button>
          </div>
        </div>
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            <p className="mt-4 text-gray-700 font-medium">저장 중...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPage;
