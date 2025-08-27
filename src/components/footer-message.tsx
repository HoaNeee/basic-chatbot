import { useAuth } from "@/context/AuthContext";
import { TMessage } from "@/types/Chat.types";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const FooterMessage = ({
  message,
  handleVote,
}: {
  message: TMessage;
  handleVote: (
    messageId: string,
    userId: string,
    type: "up-vote" | "down-vote"
  ) => Promise<void>;
}) => {
  const { state } = useAuth();
  const userId = state.user?._id as string;

  const [isCopied, setIsCopied] = useState(false);
  const [voted, setVoted] = useState<string>("");

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isCopied]);

  useEffect(() => {
    if (message.upVoted?.includes(userId)) {
      setVoted("up-vote");
    } else if (message.downVoted?.includes(userId)) {
      setVoted("down-vote");
    } else {
      setVoted("");
    }
  }, [message.upVoted, message.downVoted, userId]);

  const handleCopy = (content: string) => {
    if (isCopied) return;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
  };

  const handleVoted = async (type: "up-vote" | "down-vote") => {
    try {
      setVoted(type);
      await handleVote(message._id as string, userId, type);
    } catch (error) {
      setVoted(voted);
    }
  };

  return (
    <div className="dark:text-gray-300 flex items-center gap-2 mt-2 text-gray-500">
      <MyButton
        disabled={false}
        title="Copy"
        className="relative transition-all duration-300"
        onClick={() => handleCopy(message.content)}
      >
        <Copy
          className={`w-full h-full p-1.5 absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isCopied ? "opacity-0" : "opacity-100"
          }`}
        />
        <Check
          className={`w-full h-full p-1 absolute inset-0 flex items-center justify-center transition-opacity duration-200 text-green-600 ${
            isCopied ? "opacity-100" : "opacity-0"
          }`}
        />
      </MyButton>

      <MyButton
        disabled={voted === "up-vote"}
        title="Up Vote"
        onClick={() => handleVoted("up-vote")}
      >
        <ThumbsUp className="size-4" />
      </MyButton>

      <MyButton
        disabled={voted === "down-vote"}
        title="Down Vote"
        onClick={() => handleVoted("down-vote")}
      >
        <ThumbsDown className="size-4" />
      </MyButton>
    </div>
  );
};

const MyButton = ({
  children,
  disabled,
  onClick,
  title,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  className?: string;
}) => {
  return (
    <button
      className={`size-7 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:pointer-events-none disabled:text-gray-500/60 dark:disabled:text-gray-300/60 flex items-center justify-center transition-colors rounded-sm cursor-pointer ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FooterMessage;
