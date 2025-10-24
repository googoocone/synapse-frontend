"use client";

import { useState } from "react";

const categories = [
  "전체",
  "커머스",
  "온라인 쇼핑몰",
  "대행 서비스",
  "콘텐츠 제작",
  "지식 창업",
  "오프라인 소매",
  "임대업",
];

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("전체");

  const handleClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category); // 부모(HomePage)로 전달
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
            activeCategory === category
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
