"use client";

// 🚩 1. useState import
import { useEffect, useMemo, useState } from "react";

// Blocknote의 핵심 모듈
import {
  type Block,
  BlockNoteSchema,
  BlockNoteEditor as CoreBlockNoteEditor, // 🚩 2. 이름 충돌 방지를 위해 'as' 사용
  type PartialBlock,
} from "@blocknote/core";
// React 에디터
import { BlockNoteViewRaw } from "@blocknote/react";

// Blocknote의 기본 스타일 시트 (Tailwind와 호환됩니다)
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

// 스키마 정의
const schema = BlockNoteSchema.create();

// 컴포넌트 Props 정의
interface BlockNoteEditorProps {
  initialContent?: string;
  onChange: (contentJSON: string) => void;
  editable?: boolean;
}

// 🚩 (핵심 수정) Blocknote는 빈 배열([])을 허용하지 않으므로,
// 비어 있을 경우 기본값으로 빈 문단 블록을 생성합니다.
const defaultInitialContent: Block[] = [{ type: "paragraph", content: [] }];

export default function BlockNoteEditor({
  initialContent,
  onChange,
  editable = true,
}: BlockNoteEditorProps) {
  // 1. initialContent 문자열을 Block[] 객체로 파싱
  const initialBlocks: Block[] = useMemo(() => {
    if (!initialContent) {
      // 🚩 '[]' 대신 기본 블록 반환
      return defaultInitialContent;
    }
    try {
      const parsed = JSON.parse(initialContent);

      // 🚩 파싱된 배열이 비어있는지(length === 0) 확인
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Block[];
      }

      // 🚩 파싱 결과가 빈 배열이거나 유효하지 않으면 기본 블록 반환
      return defaultInitialContent;
    } catch (error) {
      console.error("초기 콘텐츠 파싱 실패:", error);
      // 🚩 파싱 실패 시 기본 블록 반환
      return defaultInitialContent;
    }
  }, [initialContent]);

  // 🚩 3. (핵심 수정) 'BlockNoteEditor.create()' 팩토리 메서드를 사용합니다.
  const [editor] = useState(() => {
    return CoreBlockNoteEditor.create({
      // 🚩 3-1. 'as'로 변경된 이름 사용
      schema,
      initialContent: initialBlocks, // 👈 이제 이 값은 절대 빈 배열이 아님
    });
  });

  // 3. 에디터 내용이 변경될 때마다 onChange 콜백 실행
  useEffect(() => {
    if (!editor) {
      return;
    }
    const unsubscribe = editor.onChange(() => {
      const contentJSON = JSON.stringify(editor.document);
      onChange(contentJSON);
    });
    return () => unsubscribe();
  }, [editor, onChange]);

  // 4. 에디터 뷰 렌더링
  return (
    <div className="prose prose-lg max-w-none w-full bg-white rounded-md p-4">
      <BlockNoteViewRaw editor={editor} editable={editable} theme={"light"} />
    </div>
  );
}
