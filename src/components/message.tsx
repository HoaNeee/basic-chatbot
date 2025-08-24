import { useChat } from "@/context/ChatContext";
import { TMessage } from "@/types/Chat.types";
import ReactMarkdown from "react-markdown";
import AIThinking from "./ai-thinking";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sparkles } from "lucide-react";

const Message = ({
  message,
  index,
  isNewMessage,
}: {
  message: TMessage;
  index: number;
  isNewMessage: boolean;
}) => {
  const { state } = useChat();

  if (message.role === "user") {
    return (
      <div
        className={`font-medium text-base flex justify-end text-white dark:text-black items-center gap-4 group/message`}
        data-type="message"
        data-role={message.role}
      >
        <div
          className="group-hover/message:opacity-100 group-hover/message:cursor-pointer group-hover/message:pointer-events-auto dark:text-white/80 text-black transition-opacity duration-200 opacity-0 pointer-events-none"
          onClick={() => console.log(message)}
        >
          edit
        </div>
        <p className="max-w-9/10 dark:bg-neutral-200 inline-block px-3 py-2 bg-black rounded-lg">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1 ${
        index === state.messages.length - 1 && isNewMessage
          ? "last-message"
          : ""
      }`}
    >
      <div className="pt-4">
        <AIThinking />
      </div>
      <div
        data-id={message._id}
        className={`p-2.5 font-normal text-base text-black dark:text-white/90 space-y-4 h-full`}
        data-type="message"
        data-role={message.role}
      >
        <ReactMarkdown
          components={{
            ul: ({ ...props }) => (
              <ul className="space-y-1.5 list-disc pl-5" {...props} />
            ),
            code: ({ ...props }) => (
              <code className="p-1 bg-gray-100 rounded-md" {...props} />
            ),
            pre: ({ ...props }) => (
              <pre
                className="bg-neutral-800 dark:bg-neutral-200 dark:text-black/80 p-4 my-3 overflow-x-auto text-gray-100 rounded-lg"
                {...props}
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
