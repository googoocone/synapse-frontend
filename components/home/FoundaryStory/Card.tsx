import Link from "next/link"; // next/link import

const Card = ({ story }: { story: any }) => {
  return (
    <Link href={`/stories/${story.id}`} className="block">
      <div className="w-full h-[500px] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
        {/* 상단 이미지 영역 */}
        <div className="relative h-[290px] shrink-0 bg-gray-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${story.image_url})` }}
          ></div>

          {/* 창업자 프로필 이미지 오버레이 */}
          {story.founder_image_url && (
            <div className="absolute bottom-3 right-3 w-20 h-20 rounded-full border-2 border-white overflow-hidden shadow-md">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${story.founder_image_url})` }}
              />
            </div>
          )}
        </div>

        {/* 하단 텍스트 영역 */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">{story.tags?.join(", ")}</p>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 h-[56px]">
              {story.title}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              {story.badges?.map((badge: string, index: number) => (
                <span
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-end justify-between">
              <p className="flex items-baseline text-[22px] font-extrabold text-gray-900">
                <span className="text-[10px] font-medium mr-1">월</span>

                {story.metric}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {story.created_at ? new Date(story.created_at).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
