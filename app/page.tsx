"use client";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/home");
      }
    };

    checkUser();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Main Content Container */}
      <div className="relative w-full max-w-[1200px] flex flex-col items-center justify-center px-4">
        {/* Center Section: Text - Video - Text */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
          {/* Left Text */}
          <div className="hidden md:block text-4xl md:text-6xl font-black text-black whitespace-nowrap">
            1인창업
          </div>

          {/* Main Video */}
          <div className="relative w-full max-w-[800px] aspect-[16/9] rounded-xl overflow-hidden bg-white">
            <video
              className="w-full h-full object-cover scale-[1.01]"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/main_video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Right Text */}
          <div className="hidden md:block text-4xl md:text-6xl font-black text-black whitespace-nowrap">
            인사이트
          </div>

          {/* Mobile Text (Visible only on small screens, stacked) */}
          <div className="md:hidden flex gap-4 text-3xl font-black text-black mt-4">
            <span>1인창업</span>
            <span>인사이트</span>
          </div>
        </div>

        {/* Bottom Text with Highlights */}
        <div className="mt-8 md:mt-12 text-center space-y-2">
          <p className="text-lg md:text-2xl text-gray-800 font-medium leading-relaxed">
            성공한 창업자들의{" "}
            <span className="relative inline-block font-bold z-10 px-1">
              {/* 아이디어 - Yellow Highlight */}
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-yellow-300 -z-10 opacity-70"></span>
              아이디어
            </span>
            와 수 년간의{" "}
            <span className="relative inline-block font-bold z-10 px-1">
              {/* 노하우 - Blue Highlight */}
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-blue-300 -z-10 opacity-70"></span>
              노하우
            </span>
          </p>
          <p className="text-lg md:text-2xl text-gray-800 font-medium leading-relaxed">
            초보도 따라할 수 있는 12단계{" "}
            <span className="relative inline-block font-bold z-10 px-1">
              {/* 실천 가이드북 - Orange Highlight */}
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-orange-300 -z-10 opacity-70"></span>
              실천 가이드북
            </span>
          </p>
        </div>

        {/* Navigation / Enter Button */}
        <div className="mt-8 md:mt-12 z-10">
          <Link href="/home">
            <button className="px-10 py-4 bg-[#ff5833] text-white text-xl font-bold rounded-full hover:bg-[#e04e2c] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Foundary 입장하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}