"use client";

import { ArrowUp, Square } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useHistory } from "@/context/HistoryContext";

const InputChat = () => {
  const [content, setContent] = useState("");

  const { state, sendMessage, createNewChat, setMessage } = useChat();
  const { updateHistory } = useHistory();
  const params = useParams();
  const id = params.id as string;

  const handleSend = async () => {
    try {
      if (!content.trim()) {
        toast.error("Message content is empty");
        return;
      }
      const newContent = content;
      setContent("");
      if (!state.chat || !id) {
        console.log("No chat found, creating a new one");
        localStorage.setItem("is_new_chat", "true");
        await createNewChat(newContent);
      } else {
        console.log("Sending message to existing chat");
        localStorage.setItem("is_new_message", "true");
        setMessage(newContent, id, "user");
        await sendMessage(newContent, id, "user");
        await updateHistory(id, { updatedAt: new Date() });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create new chat");
    }
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-700 relative w-full h-auto overflow-hidden rounded-lg">
      <Textarea
        className="min-h-25 w-full p-3 pb-10 font-normal rounded-lg"
        placeholder="Type your message here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        style={{
          fontSize: "1rem",
        }}
      />
      <div className="bottom-2 right-3 absolute">
        <Button
          onClick={handleSend}
          size={"icon"}
          className="size-7 rounded-full"
          disabled={!content.trim() || state.thinking}
        >
          <ArrowUp
            className="absolute flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: state.thinking || state.typing ? 0 : 1 }}
          />
          <Square
            className="absolute flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: state.thinking || state.typing ? 1 : 0 }}
          />
        </Button>
      </div>
    </div>
  );
};

export default InputChat;
