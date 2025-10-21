import Link from "next/link"; // next/link import

const Card = ({ story }) => {
  console.log("story image url", story);
  return (
    <Link href={`/stories/${story.id}`} className="block">
      <div className="w-full sm:w-[300px] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
        {/* 상단 이미지 영역 */}
        <div className="relative h-68 bg-gray-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${story.image_url})` }}
          ></div>
          {/* <button className="absolute top-4 right-4 text-red-500 bg-white/70 backdrop-blur-sm p-2 rounded-full">
          <Heart size={20} />
        </button> */}
        </div>

        {/* 하단 텍스트 영역 */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
            {story.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{story.tags.join(", ")}</p>
          <div className="flex items-center space-x-2 mb-4">
            {story.badges.map((badge, index) => (
              <span
                key={index}
                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex items-end justify-between">
            <p className="text-xl font-extrabold text-gray-900">
              {story.metric}
            </p>
          </div>
          <p className="text-xs text-gray-400">{story.date}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
