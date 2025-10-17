"use client";

import compass from "@/assets/compass.png";
import feedback from "@/assets/feed-back.png";
import home from "@/assets/home.png";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

const NavLinks = () => {
  const [selectedButton, setSelectedButton] = useState("Home");

  // Link에 직접 적용할 스타일. flex 속성이 포함되어 있어 w-full이 잘 동작합니다.
  const commonLinkStyles =
    "w-full h-[38px] p-2 flex text-sm items-center justify-start gap-2 cursor-pointer rounded-full hover:bg-[#d9d9d9]/30";

  return (
    <div className="w-full h-[200px] p-2 flex flex-col items-center justify-center gap-2">
      {/* 1. <button> 태그를 제거합니다.
        2. 기존 <button>에 있던 className과 onClick을 <Link>로 옮깁니다. 
      */}
      <Link
        href="/"
        onClick={() => setSelectedButton("+ 새 대화 시작")}
        className={`${commonLinkStyles} ${
          selectedButton === "+ 새 대화 시작" ? "bg-[#d9d9d9]/30" : ""
        }`}
      >
        <Image src={home} width={18} height={18} alt="home"></Image>+ 새 대화
        시작
      </Link>

      <Link
        href="/coaching"
        onClick={() => setSelectedButton("AI 코칭")}
        className={`${commonLinkStyles} ${
          selectedButton === "AI 코칭" ? "bg-[#d9d9d9]/30" : ""
        }`}
      >
        <Image src={compass} width={18} height={18} alt="home"></Image>
        AI 코칭
      </Link>

      <Link
        href="/feedback"
        onClick={() => setSelectedButton("Feed Back")}
        className={`${commonLinkStyles} ${
          selectedButton === "Feed Back" ? "bg-[#d9d9d9]/30" : ""
        }`}
      >
        <Image src={feedback} width={18} height={18} alt="home"></Image>
        Feed Back
      </Link>

      <div className="w-full border-t border-black/10"></div>
    </div>
  );
};

export default NavLinks;
