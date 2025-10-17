// 고민 제안 데이터
const suggestionData = {
  "1인 사업": [
    "초기 자본금 없이 지금 당장 사업을 시작할 수 있는 방법이 뭔가요?",
    "내 제품을 효과적으로 홍보하기 위해선 예산을 어떻게 써야 효과적일까요?",
    "자본금이 없을 땐 어떤 사업을 해야 가장 효과적일까요?",
  ],
  "무기력 극복": [
    "남들은 다 잘나가는 것 같은데, 저만 뒤처지는 기분이에요",
    "제 자신이 너무 싫어서 아무것도 시작할 수가 없어요.",
    "의욕도 없고, 재미도 없고, 무기력해요. 아무것도 하기 싫어요",
  ],
  "마인드 셋": [
    "남들이랑 비교를 하지 않으려면 어떻게 해야 할 수 있을까요?",
    "부자들이 공통적으로 하는 습관을 나도 배우고 싶어요.",
    "성공하고 싶어요, 저에게 필요한 조언을 해주세요.",
  ],
};

// 아이콘은 임의의 텍스트로 대체했습니다. 필요시 SVG나 아이콘 라이브러리를 사용하세요.
const icons: { [key: string]: string } = {
  "1인 사업": "💡",
  "무기력 극복": "💪",
  "마인드 셋": "🧠",
};

interface PromptSuggestionsProps {
  onPromptClick: (promptText: string) => void;
}

export default function PromptSuggestions({
  onPromptClick,
}: PromptSuggestionsProps) {
  return (
    <div className="flex flex-col items-center gap-20 text-center">
      <h2 className="text-3xl font-bold">해결하고 싶은 고민이 있나요?</h2>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(suggestionData).map(([title, prompts]) => (
          <div key={title} className="flex flex-col gap-3">
            <h3 className="flex items-center justify-center gap-2 font-semibold">
              <span>{icons[title]}</span>
              {title}
            </h3>
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onPromptClick(prompt)}
                className="w-full p-4 text-sm text-left bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
