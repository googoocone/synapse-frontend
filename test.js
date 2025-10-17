import genAI from "@/lib/gemini/gemini"; // 1. 방금 만든 Gemini 클라이언트 import
import { saveOrUpdateChat } from "@/lib/supabase/chat";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers"; // 1. next/headers에서 cookies를 import 합니다.
import { NextResponse } from "next/server";

// Gemini에게 역할을 부여하는 시스템 프롬프트 (수정 없음)
const SYSTEM_PROMPT = `
당신은 사용자의 고민을 깊이 이해하고 해결책을 찾아주는 전문 코치입니다.

**목표:**
당신의 목표는 3~5번의 질문 안에 사용자의 핵심 니즈를 효율적으로 파악하는 것입니다.

**규칙:**
1. 사용자가 첫 고민을 말하면, 절대로 해결책이나 영상 추천을 바로 하지 마세요.
2. 사용자의 상황을 빠르게 파악하기 위해, 가장 핵심적인 '열린 질문'을 한 번에 하나씩 하세요. 불필요한 질문은 피하세요.
3. 사용자의 니즈가 명확해졌다고 판단되면, 더 이상 질문하지 말고 즉시 답변 마지막에 [[NEEDS_IDENTIFIED]] 신호를 포함해서 응답해주세요.
4. [[NEEDS_IDENTIFIED]] 신호를 보내는 답변에는, 절대로 새로운 질문을 포함하지 마세요. 대신 사용자의 니즈를 요약하고 긍정하는 문장으로 마무리하세요.**
`;

export async function POST(request: Request) {
  try {
    const { messages, chatId } = await request.json();

    // Supabase 사용자 인증 (수정 없음)
    const cookieStore = cookies(); // 2. cookieStore를 가져옵니다.
    const supabase = await createClient(cookieStore); // 3. createClient에 cookieStore를 전달합니다.

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    //GEMINI API 호출 진입점
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT, // 시스템 프롬프트 설정
    });

    // Gemini API가 요구하는 형식으로 대화 기록(history) 변환
    const chatHistory = messages
      .slice(0, -1) // 마지막 사용자 메시지는 제외하고 היסטוריה를 만듭니다.
      .map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    const lastMessage = messages[messages.length - 1]?.text || "";

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const geminiResponseText = result.response.text();
    // --- Gemini API 호출 로직 종료 ---

    const aiResponseMessage = {
      id: messages.length + 1,
      text: geminiResponseText,
      sender: "ai",
    };

    const finalMessages = [...messages, aiResponseMessage];
    const { id: updatedChatId } = await saveOrUpdateChat(
      chatId,
      user.id,
      finalMessages
    );

    // Gemini 응답에 신호가 있는지 확인 (수정 없음)
    if (geminiResponseText.includes("[[NEEDS_IDENTIFIED]]")) {
      // [수정] AI가 보낸 텍스트를 사용하는 대신, 니즈 파악 완료 전용 메시지를 새로 생성합니다.
      const finalMessage = {
        ...aiResponseMessage, // id, sender 등은 그대로 사용
        text: "네, 이제 사용자의 핵심 니즈를 명확히 파악했습니다. 잠시만 기다려주시면, 이 고민을 해결하는 데 도움이 될 만한 영상들을 추천해 드릴게요!",
      };

      // TODO: 여기서 DB 조회 및 영상 추천 로직 실행

      return NextResponse.json({
        aiMessage: finalMessage,
        chatId: updatedChatId,
      });

      return NextResponse.json({
        aiMessage: finalMessage,
        chatId: updatedChatId,
      });
    } else {
      return NextResponse.json({
        aiMessage: aiResponseMessage,
        chatId: updatedChatId,
      });
    }
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}


route.ts 코드가 이건데 이거 그대로 써도 되냐?