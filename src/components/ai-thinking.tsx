import { Sparkles } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const AIThinking = ({
  isText,
  className,
}: {
  isText?: boolean;
  className?: string;
}) => {
  return (
    <div className={`inline-flex transition-all  ${className}`}>
      <Avatar className="size-9 border-primary/20 border">
        <AvatarFallback className="dark:bg-neutral-800 bg-white">
          <Sparkles className="size-5" />
        </AvatarFallback>
      </Avatar>
      {isText && <p className="animate-pulse">Thinking...</p>}
    </div>
  );
};

export default AIThinking;
