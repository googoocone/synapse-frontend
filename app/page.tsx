"use client";

import ChatInput from "@/components/home/ChatInput";
import ChatView from "@/components/home/ChatView";
import PromptSuggestions from "@/components/home/PromptSuggestions";
import { useState } from "react";

// 메시지 객체의 타입을 정의합니다.
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  videos?: any[]; // 나중에 영상 추천 기능을 위해 유지합니다.
}

export default function HomePage() {
  // 채팅이 시작되었는지 여부를 관리하는 상태
  const [isChatStarted, setIsChatStarted] = useState(false);
  // 현재 대화창의 메시지 목록을 관리하는 상태
  const [messages, setMessages] = useState<Message[]>([]);
  // AI가 응답을 생성 중인지 관리하는 상태
  const [isAiTyping, setIsAiTyping] = useState(false);
  // 현재 대화방의 고유 ID를 관리하는 상태
  const [chatId, setChatId] = useState<string | null>(null);

  // 메시지를 전송하는 메인 함수
  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    // 1. 사용자 메시지를 먼저 화면에 낙관적 업데이트(Optimistic Update)로 보여줍니다.
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsAiTyping(true);

    // 2. 전체 대화 기록과 현재 chatId를 백엔드 API로 전송합니다.
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // chatId가 null이면 새 대화, 값이 있으면 기존 대화임을 서버에 알립니다.
        body: JSON.stringify({ messages: updatedMessages, chatId: chatId }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.statusText}`);
      }

      const data = await response.json();

      // 3. API로부터 받은 AI 응답을 화면 메시지 목록에 추가합니다.
      setMessages((prev) => [...prev, data.aiMessage]);

      // 4. 서버로부터 받은 chatId로 프론트엔드 상태를 업데이트합니다.
      // (새 대화였다면 새로운 ID를, 기존 대화였다면 동일한 ID를 받게 됩니다.)
      if (data.chatId) {
        setChatId(data.chatId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // 사용자에게 에러가 발생했음을 알리는 메시지를 표시할 수 있습니다.
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "죄송합니다, 답변을 생성하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // 성공하든 실패하든 AI 타이핑 상태를 종료합니다.
      setIsAiTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4">
      <main
        className={`flex-1 overflow-y-auto py-8 ${
          !isChatStarted ? "flex flex-col justify-center" : ""
        }`}
      >
        {!isChatStarted ? (
          <PromptSuggestions onPromptClick={handleSendMessage} />
        ) : (
          <ChatView messages={messages} isAiTyping={isAiTyping} />
        )}
      </main>
      <div className="py-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <div className="h-5"></div>
    </div>
  );
}
