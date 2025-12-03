"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Main Content Container */}
      <div className="relative w-full max-w-[1200px] flex flex-col items-center justify-center px-4">
        {/* The Main Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2/1]">
          <Image
            src="/landing_main.png"
            alt="Foundary Story"
            fill
            className="object-contain"
            priority
          />

          {/* Video Overlay - Centered */}
          {/* Note: The size and position are approximate and may need adjustment to match the image perfectly */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[25%] aspect-[9/16] md:w-[20%] md:aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/landing_main.png" // Optional: use a specific poster if available
            >
              {/* User can replace this with the actual video path */}
              <source src="/landing_video.mp4" type="video/mp4" />
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs text-center p-2">
                Video Area
              </div>
            </video>
          </div>
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
