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
  const [content, setContent] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchStory = async () => {
      // console.log("=== FETCHING STORY ===");
      // console.log("Story ID:", storyId);

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();

      // console.log("Fetched data:", data);
      // console.log("Fetch error:", error);

      if (error) {
        console.error("데이터 로드 실패:", error);
        setStatusMessage("데이터를 불러올 수 없습니다.");
        return;
      }

      if (data) {
        // console.log("Original content length:", (data.content || "").length);
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

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (newContent: string) => {
    // console.log("Editor changed, length:", newContent.length);
    setContent(newContent);
  };

  const handleUpdate = async () => {
    // console.log("\n\n=== UPDATE STARTED ===");
    // console.log("Story ID to update:", storyId);
    // console.log("Title:", title);
    // console.log("Content length:", content.length);
    // console.log("Content preview:", content.substring(0, 200));

    setSaving(true);
    setStatusMessage("");

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
      updated_at: new Date().toISOString(),
    };

    console.log("Story data object:", {
      ...storyData,
      content: `[${storyData.content.length} chars]`,
    });

    // 먼저 현재 데이터 확인
    console.log("\n=== BEFORE UPDATE - Current DB State ===");
    const { data: beforeData } = await supabase
      .from("stories")
      .select("title, content, updated_at")
      .eq("id", storyId)
      .single();
    console.log("Before update:", {
      title: beforeData?.title,
      contentLength: beforeData?.content?.length,
      updated_at: beforeData?.updated_at,
    });

    // 업데이트 실행
    console.log("\n=== EXECUTING UPDATE ===");
    const { data, error } = await supabase
      .from("stories")
      .update(storyData)
      .eq("id", storyId)
      .select();

    console.log("\n=== UPDATE RESPONSE ===");
    console.log("Response data:", data);
    console.log("Response error:", error);

    if (data) {
      console.log("Updated data:", {
        title: data[0]?.title,
        contentLength: data[0]?.content?.length,
        updated_at: data[0]?.updated_at,
      });
    }

    // 업데이트 후 다시 조회
    // console.log("\n=== AFTER UPDATE - Verify DB State ===");
    const { data: afterData } = await supabase
      .from("stories")
      .select("title, content, updated_at")
      .eq("id", storyId)
      .single();
    // console.log("After update:", {
    //   title: afterData?.title,
    //   contentLength: afterData?.content?.length,
    //   updated_at: afterData?.updated_at,
    // });

    // 비교
    // console.log("\n=== COMPARISON ===");
    // console.log("Content changed?", beforeData?.content !== afterData?.content);
    // console.log("Title changed?", beforeData?.title !== afterData?.title);
    // console.log(
    //   "Updated_at changed?",
    //   beforeData?.updated_at !== afterData?.updated_at
    // );

    // 전체 결과를 한 번에 출력
    const debugReport = {
      storyId,
      before: {
        title: beforeData?.title,
        contentLength: beforeData?.content?.length,
        contentPreview: beforeData?.content?.substring(0, 100),
        updated_at: beforeData?.updated_at,
      },
      after: {
        title: afterData?.title,
        contentLength: afterData?.content?.length,
        contentPreview: afterData?.content?.substring(0, 100),
        updated_at: afterData?.updated_at,
      },
      changes: {
        contentChanged: beforeData?.content !== afterData?.content,
        titleChanged: beforeData?.title !== afterData?.title,
        updatedAtChanged: beforeData?.updated_at !== afterData?.updated_at,
      },
      updateResponse: {
        hasData: !!data,
        dataCount: data?.length || 0,
        hasError: !!error,
        errorMessage: error?.message,
      },
    };

    // console.log("\n\n📋 === COPY THIS DEBUG REPORT ===");
    // console.log(JSON.stringify(debugReport, null, 2));
    // console.log("=== END DEBUG REPORT ===\n\n");

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

  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-3xl font-bold mb-8">
          성공사례 수정 (Enhanced Debug)
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              본문 내용
            </label>
            <Editor
              onChange={handleEditorChange}
              initialContent={content}
              key={storyId}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded text-sm space-y-1">
            <div>
              <strong>디버그 정보:</strong>
            </div>
            <div>Story ID: {storyId}</div>
            <div>현재 content 길이: {content.length} 글자</div>
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
