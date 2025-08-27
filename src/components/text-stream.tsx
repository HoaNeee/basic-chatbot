/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/context/ChatContext";
import { useHistory } from "@/context/HistoryContext";
import { getValueInLocalStorage } from "@/lib/utils";
import Queue from "@/utils/queue";
import { useParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import AIThinking from "./ai-thinking";
import { TMessage } from "@/types/Chat.types";

const TextStream = () => {
  const { state, clearChunk, setMessage, setTyping } = useChat();
  const { newHistoryChat } = useHistory();
  const params = useParams();
  const id = params.id as string;

  const [text, setText] = useState("");
  const textRef = useRef<string>("");
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.chunks && !state.chunks.empty() && !state.thinking) {
      solveText(state.chunks);
    } else if (!state.typing && !state.thinking) {
      let lastMessage: TMessage | null = null;

      for (let i = state.messages.length - 1; i >= 0; i--) {
        if (state.messages[i].role === "user") {
          lastMessage = state.messages[i];
          break;
        }
      }

      if (lastMessage) {
        checkAndCreateNewHistory(lastMessage.content);
      }
    }
  }, [state.chunks, state.thinking, state.messages]);

  useLayoutEffect(() => {
    scrollBottom();
  }, [state]);

  const scrollToText = () => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollBottom = () => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollIntoView({
        block: "end",
      });
    }
  };

  const clearText = async () => {
    setText("");
    setTyping(false);
    clearChunk();
    setMessage(textRef.current, id, "model");
    await checkAndCreateNewHistory(textRef.current);
    textRef.current = "";
  };

  const checkAndCreateNewHistory = async (content: string) => {
    const isNewChat = getValueInLocalStorage("is_new_chat");
    if (isNewChat) {
      await newHistoryChat(id, content);
      localStorage.removeItem("is_new_chat");
    }
  };

  const solveText = (queue: Queue<string>) => {
    let intervalId: any = null;
    intervalId = setInterval(() => {
      if (queue.empty()) {
        clearText();
        clearInterval(intervalId);
        return;
      }
      const chunk = queue.front();
      queue.pop();
      setText((prev) => prev + chunk);
      textRef.current += chunk;
      scrollToText();
    }, 100);
  };

  return (
    <>
      {text && (
        <div className="flex h-full gap-1">
          <div className="p-2.5">
            <AIThinking />
          </div>
          <div
            className={`p-2.5 font-normal text-base text-black dark:text-white h-full`}
          >
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </div>
      )}
      <div className="min-h-6 w-full" ref={textContainerRef} />
    </>
  );
};

export default TextStream;
