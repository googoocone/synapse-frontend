import EditorClientWrapper from "./EditorClientWrapper";

export default async function EditStoryPage({
  params,
}: {
  params: { id: string };
}) {
  // 예시: 서버에서 기존 콘텐츠 불러오기 (DB에서 가져오는 형태로 바꿀 수 있음)
  const initialContent = "";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">스토리 수정 페이지</h1>
        {/* ✅ 클라이언트 전용 컴포넌트로 분리 */}
        <EditorClientWrapper initialContent={initialContent} />
      </div>
    </main>
  );
}
