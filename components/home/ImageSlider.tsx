// Swiper는 클라이언트에서만 동작하므로 'use client'를 명시합니다.
"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper CSS import
import "swiper/css";
import "swiper/css/pagination";

const ImageSlider = () => {
  return (
    <div className="w-full h-full bg-gray-200 rounded-2xl">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full rounded-2xl"
      >
        {/* 여기에 실제 이미지나 콘텐츠를 넣습니다 */}
        <SwiperSlide className="flex items-center justify-center bg-gray-300 text-gray-500">
          이미지 슬라이드 1
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center bg-gray-400 text-white">
          이미지 슬라이드 2
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center bg-gray-500 text-white">
          이미지 슬라이드 3
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ImageSlider;
