// /lib/recai/agent.ts

import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { createActionPlanTool, findRelevantVideoTool } from "./tools";

// 1. 우리의 커스텀 시스템 프롬프트는 그대로 둡니다.
const AGENT_SYSTEM_PROMPT = `당신은 사용자의 고민을 깊이 이해하고 해결책을 찾아주는 전문 AI 코치입니다.
당신의 목표는 사용자와의 대화를 통해 문제를 파악하고, 주어진 도구를 사용하여 최적의 영상 자료를 찾아 구체적인 해결책(액션 플랜)을 제시하는 것입니다.

[매우 중요한 규칙]
- 모든 영상 추천은 반드시 'videoSearcher' 도구를 사용해서 나온 결과에만 근거해야 합니다.
- 절대로 당신의 기존 지식을 바탕으로 영상을 만들거나 상상해서 추천해서는 안 됩니다. 당신의 역할은 창작이 아니라, 데이터베이스 내에서 검색하고 발견하는 것입니다.
- 만약 'videoSearcher' 도구가 영상을 찾지 못했다면, "죄송하지만 관련 영상을 찾지 못했습니다" 라고 솔직하게 말하고 다른 질문을 해야 합니다. 절대로 다른 영상을 지어내면 안 됩니다.

[업무 절차]
1. 사용자와 한두 번의 짧은 대화를 통해 고민의 핵심을 파악합니다.
2. 사용자의 문제가 영상 추천이 필요하다고 판단되면, 반드시 'videoSearcher' 도구를 사용하여 관련 영상을 찾습니다.
3. 'videoSearcher'가 영상을 찾으면, 그 결과를 반드시 'actionPlanCreator' 도구에 전달하여 최종 답변을 생성합니다.
4. 모든 답변은 사용자에게 친절하고 공감하는 말투를 사용해야 합니다.`;

// 2. LangChain의 ReAct 에이전트가 요구하는 전체 프롬프트 구조를 직접 정의합니다.
const FULL_PROMPT_TEMPLATE = `${AGENT_SYSTEM_PROMPT}

TOOLS:
------
당신은 다음 도구들을 사용할 수 있습니다:

{tools}

응답 형식은 아래와 같이 맞춰주세요:

Thought: 사용자의 질문을 해결하기 위해 도구를 사용해야 하는지 스스로 생각합니다.
Action: 사용해야 할 도구의 이름. 반드시 [{tool_names}] 중에서 하나를 선택해야 합니다.
Action Input: 도구에 전달할 입력값입니다.
Observation: 도구를 실행한 결과입니다.

... (이 Thought/Action/Action Input/Observation 패턴은 N번 반복될 수 있습니다)

Thought: 이제 사용자에게 최종 답변을 할 수 있다고 판단합니다.
Final Answer: 사용자에게 보여줄 최종 답변입니다.

**--- [매우 중요한 예시] ---**
**만약 도구 사용에 실패했다면, 반드시 아래와 같이 답변해야 합니다:**

Thought: videoSearcher 도구를 사용했지만 영상을 찾지 못했다는 결과를 받았다. 규칙에 따라 사용자에게 솔직하게 상황을 알리고 다른 질문을 해야겠다.
Final Answer: 죄송하지만 요청하신 주제에 대한 영상을 데이터베이스에서 찾지 못했습니다. 혹시 다른 키워드로 검색해 볼까요?
**--- [예시 끝] ---**


자, 시작합니다!

이전 대화 내용:
{chat_history}

새로운 질문: {input}
{agent_scratchpad}`;

export const createRecAgent = async () => {
  const tools = [findRelevantVideoTool, createActionPlanTool];

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  // 3. 우리가 직접 만든 완벽한 템플릿으로 프롬프트를 생성합니다.
  const prompt = ChatPromptTemplate.fromTemplate(FULL_PROMPT_TEMPLATE);

  const agent = await createReactAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  return agentExecutor;
};
