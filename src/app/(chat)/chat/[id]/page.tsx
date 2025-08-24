"use client";

import Chats from "@/components/chats";
import { useChat } from "@/context/ChatContext";
import { getValueInLocalStorage } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ChatPage = () => {
  const { state, clearChat, getChatWithId } = useChat();

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearChat();
      window.location.href = "/";
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.error]);

  useEffect(() => {
    const isNewChat = getValueInLocalStorage("is_new_chat");
    if (!isNewChat) {
      getChatWithId(id);
    }
  }, [id]);

  if (state.loading) {
    return <div className="flex-1" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`relative flex-1 overflow-hidden overflow-y-auto`}
        style={{
          scrollBehavior: state.thinking ? "smooth" : "unset",
        }}
      >
        <Chats />
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPage;
