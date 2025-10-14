"use client";

import ChatInput from "@/components/home/ChatInput"; // 아래에서 만들 컴포넌트
import ChatView from "@/components/home/ChatView"; // 아래에서 만들 컴포넌트
import PromptSuggestions from "@/components/home/PromptSuggestions"; // 아래에서 만들 컴포넌트
import { useState } from "react";

// 메시지 객체의 타입을 정의합니다 (TypeScript 사용 시)
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function HomePage() {
  // 채팅이 시작되었는지 여부를 관리하는 상태
  const [isChatStarted, setIsChatStarted] = useState(false);
  // 채팅 메시지 목록을 관리하는 상태
  const [messages, setMessages] = useState<Message[]>([]);

  // 메시지를 전송하는 함수
  const handleSendMessage = (inputText: string) => {
    // 입력이 없으면 아무것도 하지 않음
    if (!inputText.trim()) return;

    // 채팅이 시작되지 않았다면, 상태를 변경
    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    // 새 메시지를 기존 메시지 목록에 추가
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // TODO: 여기에 AI에게 메시지를 보내고 응답을 받는 로직을 추가합니다.
    // 예: const aiResponse = await getAiResponse(inputText);
    // setMessages(prev => [...prev, aiResponse]);
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
          <ChatView messages={messages} />
        )}
      </main>

      <div className="py-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <div className="h-10"></div>
    </div>
  );
}
