// components/NewFoundaryCard.tsx

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface CardProps {
  href: string;
  imageUrl: StaticImageData | string;
  category: string;
  categoryStyle?: string;
  title: string;
  tag: string;
  amount: string;
  amountPrefix?: string;
}

export default function NewFoundaryCard({
  href,
  imageUrl,
  category,
  categoryStyle = "bg-amber-400 text-black",
  title,
  tag,
  amount,
  amountPrefix = "월",
}: CardProps) {
  return (
    <Link
      href={href}
      className="block w-full max-w-[390px] mx-auto rounded-lg duration-300 group"
    >
      {/* 1. 이미지 영역 */}
      <div className="relative w-full aspect-[390/320] overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* 1-1. 상단 카테고리 태그 */}
        <div
          className={`absolute top-4 left-0 w-[120px] h-[30px] flex items-center justify-center text-xs font-semibold rounded-r-md ${categoryStyle}`}
        >
          {category}
        </div>
      </div>

      {/* 2. 콘텐츠 영역 */}
      <div
        className="
          relative z-10 w-[calc(100%-30px)] max-w-[360px] min-h-[120px] p-4 bg-white  
          mx-auto mt-[-30px] 
          rounded-lg shadow-lg 
          transition-transform duration-300 ease-out 
          group-hover:-translate-y-2 
        "
      >
        {/* 2-1. 제목 */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 min-h-[3.25rem] line-clamp-2">
          {title}
        </h3>

        {/* 2-2. 하단 태그 및 금액 영역 */}
        <div className="flex items-center justify-between mt-2">
          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {tag}
          </span>
          <div className="flex items-baseline">
            <span className="text-xs sm:text-sm font-medium text-gray-500 mr-1">
              {amountPrefix}
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {amount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
