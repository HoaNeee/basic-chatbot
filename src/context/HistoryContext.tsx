/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TChat } from "@/types/Chat.types";
import { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";
import { del, get, patch } from "@/lib/request";

interface HistoryState {
  history: TChat[];
  loading: boolean;
  error: string | null;
}

type HistoryAction =
  | { type: "HISTORY_PENDING" }
  | { type: "HISTORY_SUCCESS"; payload: TChat[] }
  | { type: "HISTORY_ERROR"; payload: string | null };

const initialState = {
  history: [],
  loading: true,
  error: null,
};

const historyReducer = (
  state: HistoryState,
  action: HistoryAction
): HistoryState => {
  switch (action.type) {
    case "HISTORY_PENDING":
      return { ...state, loading: true, error: null };
    case "HISTORY_SUCCESS":
      return { ...state, history: action.payload, loading: false };
    case "HISTORY_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

interface HistoryContextType {
  state: HistoryState;
  newHistoryChat: (chatId: string, content: string) => Promise<void>;
  clearHistory: () => void;
  deleteHistoryChat: (chatId: string) => Promise<void>;
  updateHistory: (chatId: string, history: Partial<TChat>) => Promise<void>;
  clearError: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }

  return context;
};

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const { state: authState } = useAuth();

  useEffect(() => {
    if (authState.user) {
      getChatHistory();
    }
  }, [authState.user]);

  const getChatHistory = async () => {
    try {
      dispatch({ type: "HISTORY_PENDING" });
      const response = await get("/api/chat");
      dispatch({ type: "HISTORY_SUCCESS", payload: response });
    } catch (error: any) {
      dispatch({
        type: "HISTORY_ERROR",
        payload: error.message || "Failed to fetch chat history",
      });
    }
  };

  const newHistoryChat = async (chatId: string, content: string) => {
    try {
      const response = await patch(`/api/chat/${chatId}`, {
        content,
      });
      const history = state.history;
      dispatch({ type: "HISTORY_SUCCESS", payload: [response, ...history] });
    } catch (error: any) {
      dispatch({
        type: "HISTORY_ERROR",
        payload: error.message || "Failed to create new chat history",
      });
    }
  };

  const deleteHistoryChat = async (chatId: string) => {
    try {
      await del(`/api/chat/${chatId}`);
      const history = state.history.filter((chat) => chat._id !== chatId);
      dispatch({ type: "HISTORY_SUCCESS", payload: history });
    } catch (error: any) {
      dispatch({
        type: "HISTORY_ERROR",
        payload: error.message || "Failed to delete chat history",
      });
    }
  };

  const updateHistory = async (chatId: string, history: Partial<TChat>) => {
    try {
      await patch(`/api/chat/${chatId}`, history);
      const histories = [...state.history];
      const index = histories.findIndex((chat) => chat._id === chatId);

      if (index !== -1) {
        histories[index] = { ...histories[index], ...history };
      }

      dispatch({ type: "HISTORY_SUCCESS", payload: histories });
    } catch (error: any) {
      dispatch({
        type: "HISTORY_ERROR",
        payload: error.message || "Failed to update chat history",
      });
    }
  };

  const clearHistory = () => {
    dispatch({ type: "HISTORY_SUCCESS", payload: [] });
  };

  const clearError = () => {
    dispatch({ type: "HISTORY_ERROR", payload: null });
  };

  return (
    <HistoryContext.Provider
      value={{
        state,
        newHistoryChat,
        clearHistory,
        deleteHistoryChat,
        updateHistory,
        clearError,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
