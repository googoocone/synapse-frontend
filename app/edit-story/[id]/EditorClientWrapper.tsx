"use client";

import dynamic from "next/dynamic";

// ✅ 이제 여기서는 "use client" 환경이므로 ssr: false 사용 가능
const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
});

export default function EditorClientWrapper({
  initialContent,
}: {
  initialContent: string;
}) {
  const handleChange = (json: string) => {
    console.log("콘텐츠 변경됨:", json);
    // ✅ 여기에 Supabase나 API로 저장 로직 추가 가능
  };

  return (
    <BlockNoteEditor initialContent={initialContent} onChange={handleChange} />
  );
}
