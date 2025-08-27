import { useChat } from "@/context/ChatContext";
import { TMessage } from "@/types/Chat.types";
import React from "react";
import AIThinking from "./ai-thinking";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import BoxWeather from "./box-weather";
import FooterMessage from "./footer-message";

interface IMessageIntentProps {
  message: TMessage;
  index: number;
  isNewMessage: boolean;
}

const MessageIntent = (props: IMessageIntentProps) => {
  const { message, index, isNewMessage } = props;

  const { state, handleVote } = useChat();

  return (
    <div
      className={`flex w-full overflow-hidden gap-1 ${
        index === state.messages.length - 1 && isNewMessage
          ? "last-message"
          : ""
      }`}
    >
      <div className="pt-1.5">
        <AIThinking />
      </div>
      <div
        data-id={message._id}
        className={`p-2.5 font-normal text-base text-black dark:text-white/90 space-y-4 h-full max-w-full md:max-w-3xl overflow-hidden`}
        data-type="message"
        data-role={message.role}
      >
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {message.content}
        </ReactMarkdown>
        <BoxWeather weatherData={message.data} />
        <FooterMessage message={message} handleVote={handleVote} />
      </div>
    </div>
  );
};

export default MessageIntent;
