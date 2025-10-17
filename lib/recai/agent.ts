// /lib/recai/agent.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { findRelevantVideoTool } from "./tools"; // ✅ actionPlanTool 제거

const SYSTEM = `너의 목표는 "videoSearcher" 도구를 딱 한 번 호출해,
그 도구가 반환한 JSON 문자열을 **아무 수정 없이 그대로** 최종 답변으로 내보내는 것이다.
- DB 외부 영상/링크는 절대 금지.
- 도구 실패 시에는 "관련 영상을 찾지 못했습니다." 한 줄만 반환.`;

export const createRecAgent = async () => {
  const tools = [findRelevantVideoTool];

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.0,
    // ⚠️ 에이전트 LLM에서는 JSON 모드/스트리밍 금지 (파서 충돌 방지)
    streaming: false as any,
    // @ts-ignore
    generationConfig: { maxOutputTokens: 512 },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createToolCallingAgent({ llm, tools, prompt });

  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
    returnIntermediateSteps: true,
    maxIterations: 2,
  });
};
