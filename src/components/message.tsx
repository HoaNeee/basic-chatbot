import { useChat } from "@/context/ChatContext";
import { TMessage } from "@/types/Chat.types";
import ReactMarkdown from "react-markdown";
import AIThinking from "./ai-thinking";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import MessageIntent from "./message-intent";

const Message = ({
  message,
  index,
  isNewMessage,
}: {
  message: TMessage;
  index: number;
  isNewMessage: boolean;
}) => {
  const { state, sendMessage, setMessage } = useChat();
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(message.content);

  const params = useParams();
  const id = params.id as string;

  const handleResend = async () => {
    setIsEdit(false);
    localStorage.setItem("is_new_message", "true");
    setMessage(content, id, "user");
    await sendMessage(content, id, "user");
  };

  if (message.role === "user") {
    return !isEdit ? (
      <div
        className={`font-medium text-base flex justify-end text-white dark:text-black items-center gap-4 group/message`}
        data-type="message"
        data-role={message.role}
      >
        <div
          className="group-hover/message:opacity-100 group-hover/message:cursor-pointer group-hover/message:pointer-events-auto dark:text-white/80 hover:bg-gray-100 text-black transition-opacity duration-200 opacity-0 pointer-events-none rounded-sm flex items-center justify-center size-6 p-0.5 dark:hover:bg-gray-700"
          onClick={() => setIsEdit(true)}
        >
          <PenLine className="size-4" />
        </div>
        <p className="max-w-9/10 dark:bg-neutral-200 inline-block px-3 py-2 bg-black rounded-lg">
          {message.content}
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-end">
        <Textarea
          className="max-w-9/10 min-h-25 text-base font-normal"
          defaultValue={message.content}
          style={{
            fontSize: "inherit",
            lineHeight: "inherit",
            fontWeight: "inherit",
          }}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleResend();
            }
          }}
        />
        <div className="flex items-center gap-2 mt-3">
          <Button variant={"outline"} onClick={() => setIsEdit(false)}>
            Cancel
          </Button>
          <Button onClick={handleResend}>Send</Button>
        </div>
      </div>
    );
  }

  if (message.status === "failed") {
    return (
      <div className="dark:text-white/90 md:max-w-3xl max-w-full space-y-4 overflow-hidden text-base font-normal text-black">
        <p className="p-2.5 text-white bg-red-500 inline-block rounded-md mt-2">
          Error, please try again later.
        </p>
      </div>
    );
  }

  if (message.intent === "weather") {
    return (
      <MessageIntent
        message={message}
        index={index}
        isNewMessage={isNewMessage}
      />
    );
  }

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
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            ul: ({ ...props }) => (
              <ul className="space-y-1.5 list-disc pl-5" {...props} />
            ),
            pre: ({ ...props }) => (
              <pre
                className="md:max-w-3xl max-w-full overflow-x-auto rounded-md"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(100, 100, 100, 0.5) transparent",
                }}
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
