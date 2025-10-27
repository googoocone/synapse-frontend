// app/stories/[id]/loading.tsx

export default function Loading() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative w-full h-64 md:h-96 bg-gray-300 animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative pb-16">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
          {/* 제목 스켈레톤 */}
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-4" />

          {/* 메타 정보 스켈레톤 */}
          <div className="flex gap-4 mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* 컨텐츠 스켈레톤 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
