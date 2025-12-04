"use client";

import { useState, useRef } from "react";
import BlockNoteRenderer from "@/components/BlockNoteRenderer";

type StoryDetailTabsProps = {
  interviewContent: any;
  guideContent: any;
  isLoggedIn: boolean;
};

type TabId = "interview" | "guide";

const tabs: { id: TabId; label: string; description: string }[] = [
  {
    id: "interview",
    label: "인터뷰",
    description: "창업자가 직접 이야기하는 성장 과정과 마인드셋",
  },
  {
    id: "guide",
    label: "실전 가이드",
    description: "지금 당장 따라 할 수 있는 실행 전략과 체크리스트",
  },
];

const StoryDetailTabs = ({
  interviewContent,
  guideContent,
  isLoggedIn,
}: StoryDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("interview");
  const topRef = useRef<HTMLDivElement | null>(null);

  const [currentStep, setCurrentStep] = useState(0);

  const currentContent =
    activeTab === "interview" ? interviewContent : guideContent;

  const hasContent =
    currentContent && Array.isArray(currentContent)
      ? currentContent.length > 0
      : !!currentContent;

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setCurrentStep(0); // 탭 변경 시 스텝 초기화
    // 탭 변경 시 이 컴포넌트의 상단으로 스크롤
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextStep = () => {
    if (Array.isArray(guideContent) && currentStep < guideContent.length - 1) {
      setCurrentStep((prev) => prev + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={topRef} className="mt-6">
      {/* 상단 고정되는 탭 영역 */}
      <div className="sticky top-13 sm:top-15 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 pb-3">
        <div className="flex justify-center pt-2">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 ">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={[
                    "relative px-4 py-2 text-sm md:text-base font-medium rounded-lg transition-all cursor-pointer",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer",
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-orange-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 설명 */}
        <p className="mt-3 text-xs md:text-sm text-gray-500 text-center">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>
      </div>

      {/* 콘텐츠 카드 */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 md:p-6">
        {!hasContent ? (
          <div className="text-sm text-gray-400">
            아직{" "}
            {activeTab === "interview"
              ? "인터뷰 내용이 준비되지 않았습니다."
              : "실전 가이드가 준비되지 않았습니다."}
          </div>
        ) : (
          // 🔑 탭이 바뀔 때마다 내용 전체를 재마운트
          <div key={activeTab} className="prose prose-lg max-w-none">
            {activeTab === "guide" && Array.isArray(guideContent) ? (
              // 가이드 콘텐츠가 배열일 경우 (단계별 보기)
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Step {currentStep + 1} / {guideContent.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={currentStep === guideContent.length - 1}
                      className="px-3 py-1 text-sm bg-gray-900 text-white border border-gray-900 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {guideContent[currentStep].title}
                  </h3>
                  {isLoggedIn ? (
                    <BlockNoteRenderer
                      content={guideContent[currentStep].content}
                    />
                  ) : (
                    <div className="relative">
                      <div className="blur-sm pointer-events-none select-none">
                        <BlockNoteRenderer
                          content={guideContent[currentStep].content}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-lg bg-white/95 px-4 py-3 text-sm font-medium text-gray-700 shadow-md">
                          전체 내용을 보시려면 로그인 해주세요.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === guideContent.length - 1}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    다음 단계
                  </button>
                </div>
              </div>
            ) : (
              // 기존 렌더링 방식 (인터뷰 또는 레거시 가이드)
              <>
                {isLoggedIn ? (
                  <BlockNoteRenderer content={currentContent} />
                ) : (
                  <div className="relative">
                    <div className="blur-sm pointer-events-none select-none">
                      <BlockNoteRenderer content={currentContent} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-white/95 px-4 py-3 text-sm font-medium text-gray-700 shadow-md">
                        전체 내용을 보시려면 로그인 해주세요.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDetailTabs;
