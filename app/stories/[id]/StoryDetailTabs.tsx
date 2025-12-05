"use client";

import { useState, useRef } from "react";
import BlockNoteRenderer from "@/components/BlockNoteRenderer";
import LoginRequestOverlay from "@/components/LoginRequestOverlay";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div ref={topRef} className="mt-6 pb-24">
      {/* 탭 설명 (상단으로 이동) */}
      <div className="text-center mb-8">
        <p className="text-sm md:text-base text-gray-500">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>
      </div>

      {/* 하단 고정 탭 영역 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={[
                  "flex-1 py-3 text-sm md:text-base font-medium transition-all cursor-pointer text-center",
                  isActive
                    ? "text-gray-900 font-bold"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                <span className="relative">
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 콘텐츠 카드 */}
      <div className="mt-8 mx-auto w-full md:w-[720px] ">
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

                <div className="relative min-h-[300px] group/container">
                  {/* 왼쪽 클릭 영역 (이전 단계) */}
                  {currentStep > 0 && (
                    <div
                      onClick={handlePrevStep}
                      className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-start pl-2 md:pl-4 cursor-pointer z-10 hover:bg-gradient-to-r hover:from-black/5 hover:to-transparent transition-all group/nav"
                    >
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover/nav:opacity-100 transition-opacity transform -translate-x-2 group-hover/nav:translate-x-0">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  )}

                  {/* 오른쪽 클릭 영역 (다음 단계) */}
                  {currentStep < guideContent.length - 1 && (
                    <div
                      onClick={handleNextStep}
                      className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-end pr-2 md:pr-4 cursor-pointer z-10 hover:bg-gradient-to-l hover:from-black/5 hover:to-transparent transition-all group/nav"
                    >
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover/nav:opacity-100 transition-opacity transform translate-x-2 group-hover/nav:translate-x-0">
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-4 px-0 md:px-0">
                    {guideContent[currentStep].title}
                  </h3>
                  <div className="px-0 md:px-0">
                    {isLoggedIn ? (
                      <BlockNoteRenderer
                        content={guideContent[currentStep].content}
                      />
                    ) : (
                      <div className="relative">
                        <div className="max-h-[400px] overflow-hidden relative">
                          <div className="pointer-events-none select-none">
                            <BlockNoteRenderer
                              content={guideContent[currentStep].content}
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
                        </div>
                        <div className="relative z-20 -mt-8">
                          <LoginRequestOverlay />
                        </div>
                      </div>
                    )}
                  </div>
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
                    <div className="max-h-[1500px] overflow-hidden relative">
                      <div className="pointer-events-none select-none">
                        <BlockNoteRenderer content={currentContent} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
                    </div>
                    <div className="relative z-20 -mt-8">
                      <LoginRequestOverlay />
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