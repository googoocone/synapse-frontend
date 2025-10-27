"use client";

import { createClient } from "@/utils/supabase/client"; // Supabase 클라이언트 import
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

// Supabase 클라이언트를 한 번만 생성합니다.
const supabase = createClient();

// BlockNote 에디터 컴포넌트
const Editor = ({ initialContent, onChange }) => {
  // --- 이미지 업로드 핸들러 함수 ---
  const handleUpload = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;

    // 1. Supabase Storage에 파일 업로드
    const { data, error } = await supabase.storage
      .from("story_images") // 1단계에서 만든 버킷 이름
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("이미지 업로드 실패:", error);
      return ""; // 실패 시 빈 문자열 반환
    }

    // 2. 업로드된 이미지의 Public URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from("story_images").getPublicUrl(fileName);

    // 3. BlockNote 에디터에 이미지 URL 반환
    return publicUrl;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    // --- 여기에 업로드 핸들러를 연결합니다 ---
    uploadFile: handleUpload,
  });

  const handleEditorChange = () => {
    onChange(JSON.stringify(editor.document, null, 2));
  };

  return (
    <div className="border rounded-lg">
      <BlockNoteView
        editor={editor}
        onChange={handleEditorChange}
        theme="light"
      />
    </div>
  );
};

export default Editor;
