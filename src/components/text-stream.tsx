/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/context/ChatContext";
import { useHistory } from "@/context/HistoryContext";
import { getValueInLocalStorage } from "@/lib/utils";
import Queue from "@/utils/queue";
import { useParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import AIThinking from "./ai-thinking";

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
    }
  }, [state.chunks, state.thinking]);

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
    const isNewChat = getValueInLocalStorage("is_new_chat");
    if (isNewChat) {
      await newHistoryChat(id, textRef.current);
      localStorage.removeItem("is_new_chat");
    }

    textRef.current = "";
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
