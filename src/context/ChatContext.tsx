/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { get, patch, post } from "@/lib/request";
import { TChat, TMessage } from "@/types/Chat.types";
import { createContext, useContext, useReducer } from "react";
import { useRouter } from "next/navigation";
import Queue from "@/utils/queue";
import { genUUID } from "@/lib/utils";

interface ChatState {
  chat: TChat | null;
  messages: TMessage[];
  loading: boolean;
  error: string | null;
  chunks: Queue<string>;
  thinking: boolean;
  typing: boolean;
}

type ChatAction =
  | { type: "CHAT_PENDING" }
  | { type: "CHAT_MESSAGES_PENDING" }
  | { type: "CHAT_THINKING" }
  | { type: "CHAT_SUCCESS"; payload: TChat | null }
  | { type: "CHAT_MESSAGES_SUCCESS"; payload: TMessage[] }
  | { type: "CHAT_ERROR"; payload: string | null }
  | { type: "CHAT_MESSAGES_ERROR"; payload: string | null }
  | {
      type: "CHAT_THINKED";
      payload: Queue<string>;
    }
  | { type: "CHAT_THINKING_ERROR"; payload: string | null }
  | { type: "CHAT_TYPING" }
  | { type: "CHAT_TYPED" };

const initialState = {
  chat: null,
  messages: [],
  loading: true,
  error: null,
  chunks: new Queue<string>(),
  thinking: false,
  typing: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "CHAT_PENDING":
      return { ...state, loading: true, error: null };
    case "CHAT_THINKING":
      return { ...state, thinking: true, error: null };
    case "CHAT_SUCCESS":
      return { ...state, chat: action.payload, loading: false };
    case "CHAT_THINKED":
      return { ...state, chunks: action.payload, thinking: false };
    case "CHAT_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CHAT_THINKING_ERROR":
      return { ...state, error: action.payload, thinking: false };
    case "CHAT_MESSAGES_PENDING":
      return { ...state, loading: true, error: null };
    case "CHAT_MESSAGES_SUCCESS":
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };
    case "CHAT_MESSAGES_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CHAT_TYPING":
      return { ...state, typing: true, error: null };
    case "CHAT_TYPED":
      return { ...state, typing: false };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  sendMessage: (
    content: string,
    chatId: string,
    role: "user" | "model"
  ) => Promise<void>;
  createNewChat: (content: string) => Promise<void>;
  clearChunk: () => void;
  clearChat: () => void;
  setMessage: (content: string, chatId: string, role: "user" | "model") => void;
  getChatWithId: (chatId: string) => Promise<void>;
  setTyping: (typing: boolean) => void;
  clearError: () => void;
  handleVote: (
    messageId: string,
    userId: string,
    type: "up-vote" | "down-vote"
  ) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const router = useRouter();

  const createNewChat = async (content: string) => {
    dispatch({ type: "CHAT_PENDING" });
    try {
      const response = await post("/api/chat", { content });
      router.push(`/chat/${response._id}`);
      setMessage(content, response._id, "user");
      dispatch({ type: "CHAT_SUCCESS", payload: response });
      await sendMessage(content, response._id);
    } catch (error) {
      dispatch({ type: "CHAT_ERROR", payload: "Failed to create new chat" });
    }
  };

  const getChatWithId = async (chatId: string) => {
    try {
      dispatch({ type: "CHAT_MESSAGES_PENDING" });
      const response = await get(`/api/chat/${chatId}`, {
        cache: "no-store",
      });
      const { chat, messages } = response;
      dispatch({ type: "CHAT_SUCCESS", payload: chat });
      dispatch({ type: "CHAT_MESSAGES_SUCCESS", payload: messages });
    } catch (error) {
      dispatch({ type: "CHAT_ERROR", payload: "Failed to get chat" });
    }
  };

  const sendMessage = async (
    content: string,
    chatId: string,
    role: "user" | "model" = "user"
  ) => {
    dispatch({ type: "CHAT_THINKING" });
    dispatch({ type: "CHAT_TYPING" });
    const id = chatId || state.chat?._id || "";
    try {
      const result = await post(`/api/chat/${id}`, {
        content,
      });

      const queue = new Queue<string>();
      if (!result.intent) {
        const reader = result;
        const decoder = new TextDecoder("utf-8");

        while (true) {
          try {
            const stream = await reader?.read();
            if (stream?.done) {
              break;
            }
            const chunk = decoder.decode(stream?.value, { stream: true });
            queue.push(chunk);
          } catch (error) {
            throw error;
          }
        }
        dispatch({ type: "CHAT_THINKED", payload: queue });
        return;
      }
      setMessage(
        result.content,
        result.chatId,
        "model",
        result.intent,
        result.data_weather
      );
      dispatch({ type: "CHAT_THINKED", payload: queue });
      setTyping(false);
    } catch (error) {
      dispatch({
        type: "CHAT_THINKING_ERROR",
        payload: "Failed to send message",
      });
    }
  };

  const setTyping = (typing: boolean) => {
    if (typing) {
      dispatch({ type: "CHAT_TYPING" });
    } else {
      dispatch({ type: "CHAT_TYPED" });
    }
  };

  const setMessage = (
    content: string,
    chatId: string,
    role: "user" | "model",
    intent: "general" | "weather" = "general",
    data: Record<string, any> = {}
  ) => {
    const messages = state.messages;

    const message: TMessage = {
      content,
      role,
      chatId,
      userId: state.chat?.userId || "",
      data,
      intent,
      _id: genUUID(),
    };

    messages.push(message);
    dispatch({ type: "CHAT_MESSAGES_SUCCESS", payload: messages });
  };

  const clearChunk = () => {
    const newQueue = state.chunks.clear();
    dispatch({ type: "CHAT_THINKED", payload: newQueue });
  };

  const clearChat = () => {
    dispatch({ type: "CHAT_SUCCESS", payload: null });
    dispatch({ type: "CHAT_MESSAGES_SUCCESS", payload: [] });
    const newQueue = state.chunks.clear();
    dispatch({ type: "CHAT_THINKED", payload: newQueue });
  };

  const clearError = () => {
    dispatch({ type: "CHAT_ERROR", payload: null });
    dispatch({ type: "CHAT_MESSAGES_ERROR", payload: null });
    dispatch({ type: "CHAT_THINKING_ERROR", payload: null });
  };

  const handleVote = async (
    messageId: string,
    userId: string,
    type: "up-vote" | "down-vote"
  ) => {
    if (!messageId) return;
    const messages = state.messages;

    try {
      const response = await patch(
        `/api/chat/${state.chat?._id}/message/${messageId}/${type}`,
        {
          userId,
        }
      );
      const { upVoted = [], downVoted = [] } = response;
      const index = messages.findIndex((msg) => msg._id === messageId);

      console.log(response);

      // if (index !== -1) {
      //   messages[index].upVoted = upVoted;
      //   messages[index].downVoted = downVoted;
      //   dispatch({ type: "CHAT_MESSAGES_SUCCESS", payload: messages });
      // }
    } catch (error) {
      dispatch({ type: "CHAT_ERROR", payload: "Failed to vote on message" });
      dispatch({ type: "CHAT_MESSAGES_SUCCESS", payload: messages });
      throw error;
    }
  };

  const value = {
    state,
    sendMessage,
    createNewChat,
    clearError,
    clearChunk,
    clearChat,
    setMessage,
    getChatWithId,
    setTyping,
    handleVote,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
