import Header from "@/components/layout/Header";
import localFont from "next/font/local";

import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import "./globals.css";

// Inter 폰트 정의
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title:
    "1인창업 파운더리 | 무자본 창업부터 월 1억까지, 따라만 하면 되는 성공사례 모음",
  description:
    "국내 최초 1인창업 콘텐츠 플랫폼. 1인창업, 무자본·소자본 창업, 구매대행, 중개업, 온라인 비즈니스 등 실제 수익화 사례를 모아 누구나 따라할 수 있는 창업 플레이북을 제공합니다.",
  keywords: [
    "1인창업",
    "무자본창업",
    "소자본창업",
    "소액창업",
    "부업",
    "온라인비즈니스",
    "국내창업플랫폼",
    "청년창업",
    "직장인부업",
    "대학생부업",
    "창업아이템",
    "창업플레이북",
    "수익화모델",
    "창업성공사례",
    "구매대행",
  ],
  openGraph: {
    title: "1인창업 파운더리 | 무자본 창업부터 월 1억까지",
    description:
      "실제 수익이 검증된 국내 창업사례 아카이브. 틱톡 라이브, 스마트스토어, 용역 소개업 등 현실적인 무자본·소자본 창업 파운더리을 제공합니다.",
    url: "https://foundary.kr",
    siteName: "1인창업 파운더리",
    images: [
      {
        url: "https://foundary.kr/images/og-main.png",
        width: 1200,
        height: 630,
        alt: "1인창업 파운더리 플랫폼 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "1인창업 파운더리 | 따라만 하면 되는 창업 성공사례 모음",
    description:
      "무자본 창업부터 월 1억 달성까지, 국내 1인창업 성공사례를 모두 모았습니다. 현실 가능한 창업 모델을 따라 해보세요.",
    images: ["https://foundary.kr/images/og-main.png"],
  },
  alternates: {
    canonical: "https://foundary.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.NodeNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} bg-gray-100`}>
      <body
        className={`${pretendard.className} antialiased min-h-screen flex flex-col bg-gray-100`}
      >
        <Header />
        <main className="w-full sm:w-[1200px] flex-1 mt-[70px] mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
