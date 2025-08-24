import React from "react";
import Message from "./message";
import { useChat } from "@/context/ChatContext";

import TextStream from "./text-stream";
import useNewMessage from "@/hooks/use-new-message";
import AIThinking from "./ai-thinking";

const Chats = () => {
  const { state } = useChat();

  const isNewMessage = useNewMessage();

  return (
    <div className="w-full h-full max-w-3xl p-4 mx-auto">
      <div className="h-full space-y-2">
        {state.messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            index={index}
            isNewMessage={isNewMessage}
          />
        ))}

        <div
          className={`${
            state.typing ? `h-9/10 flex flex-col justify-between` : "h-auto"
          }`}
        >
          {state.thinking ? (
            <AIThinking className="p-2.5 mt-4 items-center gap-2" isText />
          ) : (
            <div />
          )}
          <TextStream />
        </div>
      </div>
    </div>
  );
};

export default Chats;
