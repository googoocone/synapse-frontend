"use client";

import { useEffect } from "react";

// useCreateBlockNote는 @blocknote/react에서 import 합니다.
import { useCreateBlockNote } from "@blocknote/react";
// BlockNoteView는 UI 컴포넌트이므로 @blocknote/mantine에서 import 합니다.
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

// DB에 저장된 JSON 콘텐츠를 읽기 전용으로 보여주는 컴포넌트
const BlockNoteRenderer = ({ content }: { content: string | undefined | null }) => {
  // 1. (★수정된 부분★)
  // DB에서 가져온 '문자열'을 '객체/배열'로 변환(파싱)합니다.
  let parsedContent;
  try {
    parsedContent = content ? JSON.parse(content) : undefined;
  } catch (error) {
    console.error("BlockNote content 파싱 실패:", error, content);
    parsedContent = undefined; // 에러 시 빈 화면
  }

  // 2. (★수정된 부분★)
  // 변환된 'parsedContent'를 initialContent로 사용합니다.
  const editor = useCreateBlockNote({
    initialContent: parsedContent,
  });

  // 3. (★추가된 부분★)
  // parsedContent가 변경되면 에디터 내용을 업데이트합니다.
  useEffect(() => {
    if (editor && parsedContent) {
      editor.replaceBlocks(editor.document, parsedContent);
    }
  }, [editor, parsedContent]);

  if (!editor) {
    return <div>Loading content...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 min-w-0">
        <BlockNoteView editor={editor} editable={false} theme="light" />
      </div>
    </div>
  );
};

export default BlockNoteRenderer;
