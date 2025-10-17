// /app/api/chat/route.ts

import { createRecAgent } from "@/lib/recai/agent";
import { saveOrUpdateChat } from "@/lib/supabase/chat";
import { createClient } from "@/utils/supabase/server";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { messages, chatId } = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 1. RecAI 에이전트 생성
    const agentExecutor = await createRecAgent();

    // 2. LangChain 형식으로 대화 기록 변환
    const chatHistory = messages
      .slice(0, -1)
      .map((msg: any) =>
        msg.sender === "user"
          ? new HumanMessage(msg.text)
          : new AIMessage(msg.text)
      );
    const lastMessage = messages[messages.length - 1]?.text || "";

    // 3. 에이전트 실행! (사용자 입력과 대화 기록을 함께 전달)
    const result = await agentExecutor.invoke({
      input: lastMessage,
      chat_history: chatHistory,
    });

    // 4. 에이전트의 최종 답변 처리
    let aiResponseMessage;
    try {
      // actionPlanCreator가 반환한 JSON 문자열을 파싱
      const parsedOutput = JSON.parse(result.output);
      aiResponseMessage = {
        id: messages.length + 1,
        sender: "ai",
        ...parsedOutput,
      };
    } catch (e) {
      // 일반 대화 응답 처리
      aiResponseMessage = {
        id: messages.length + 1,
        text: result.output,
        sender: "ai",
      };
    }

    const finalMessages = [...messages, aiResponseMessage];
    const { id: updatedChatId } = await saveOrUpdateChat(
      chatId,
      user.id,
      finalMessages
    );

    return NextResponse.json({
      aiMessage: aiResponseMessage,
      chatId: updatedChatId,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
