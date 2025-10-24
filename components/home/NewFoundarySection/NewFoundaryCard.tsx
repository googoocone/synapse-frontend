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
      // 🚩 수정 1: w-[390px]만 유지. h-[390px]와 overflow-hidden 제거.
      //         그림자(shadow)는 여기서 관리합니다.
      className="block w-[390px] rounded-lg duration-300 group"
    >
      {/* 1. 이미지 영역 */}
      {/* 🚩 수정 2: 이미지에 상단 모서리 둥글게(rounded-t-lg) 처리 */}
      <div className="relative w-full h-[320px] overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className=""
        />

        {/* 1-1. 상단 카테고리 태그 (절대 위치) */}
        {/* 🚩 수정 3: 카테고리 태그가 이미지 영역 내부에 있도록 이동했습니다.
             (레이아웃은 동일하게 유지)
        */}
        <div
          className={`absolute top-4 left-0 w-[120px] h-[30px] flex items-center justify-center text-xs font-semibold rounded-r-md ${categoryStyle}`}
        >
          {category}
        </div>
      </div>

      {/* 2. 콘텐츠 영역 */}
      {/* 🚩 수정 4: 핵심 수정 사항 */}
      <div
        className="
          relative z-10 w-[360px] h-[120px] p-4 bg-white  
          mx-auto mt-[-30px] 
          rounded-lg shadow-lg 
          transition-transform duration-300 ease-out 
          group-hover:-translate-y-2 
        "
      >
        {/* 2-1. 제목 */}
        <h3 className="text-[16px] font-bold text-gray-900 h-[3.25rem] line-clamp-2">
          {title}
        </h3>

        {/* 2-2. 하단 태그 및 금액 영역 */}
        <div className="flex items-center justify-between mt-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {tag}
          </span>
          <div className="flex items-baseline">
            <span className="text-sm font-medium text-gray-500 mr-1">
              {amountPrefix}
            </span>
            <span className="text-xl font-bold text-gray-900">{amount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
