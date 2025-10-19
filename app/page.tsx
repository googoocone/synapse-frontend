"use client";

import Section1 from "@/components/home/Section1";
import Section2 from "@/components/home/Section2";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4">
      <main className=""></main>
      {/* Hero Section */}
      <Section1></Section1>
      {/* Three Step Section */}
      <Section2></Section2>
      <div className="h-5"></div>
    </div>
  );
}
