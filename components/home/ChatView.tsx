interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

interface ChatViewProps {
  messages: Message[];
}

export default function ChatView({ messages }: ChatViewProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-md p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-[#f8f9fb] text-black"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}
