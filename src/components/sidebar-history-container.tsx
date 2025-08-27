"use client";

import { useHistory } from "@/context/HistoryContext";
import Histories from "./histories";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { useCallback, useEffect, useState } from "react";

const SidebarHistoryContainer = () => {
  const { state, deleteHistoryChat, updateHistory } = useHistory();
  const [historiesState, setHistoriesState] = useState<
    {
      day: string;
      histories: typeof state.history;
    }[]
  >([]);

  const handleSolveDay = useCallback(() => {
    const oneDay = 1000 * 60 * 60 * 24;
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();
    const endToday = today + oneDay;
    const historiesToday = state.history.filter((chat) => {
      const chatTime = new Date(chat.updatedAt).getTime();
      return chatTime >= today && chatTime < endToday;
    });
    const yesterday = today - oneDay;
    const historiesYesterday = state.history.filter((chat) => {
      const chatTime = new Date(chat.updatedAt).getTime();
      return chatTime >= yesterday && chatTime < today;
    });

    const historiesRemaining = state.history.filter((chat) => {
      const chatTime = new Date(chat.updatedAt).getTime();
      return chatTime < yesterday;
    });

    setHistoriesState([
      {
        day: "Today",
        histories: historiesToday,
      },
      {
        day: "Yesterday",
        histories: historiesYesterday,
      },
      {
        day: "Earlier",
        histories: historiesRemaining,
      },
    ]);
  }, [state.history]);

  useEffect(() => {
    handleSolveDay();
  }, [handleSolveDay]);

  const renderLoading = () => {
    return (
      <div className="flex flex-col h-full gap-3 pr-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="w-full h-6" key={index} />
        ))}
      </div>
    );
  };

  return state.loading ? (
    renderLoading()
  ) : state.history.length > 0 ? (
    <>
      {historiesState.map((item, index) => {
        return item.histories.length > 0 ? (
          <SidebarGroup key={index} className="pb-0">
            <SidebarGroupLabel>{item.day}</SidebarGroupLabel>
            <SidebarGroupContent>
              <Histories
                histories={item.histories}
                updateHistory={updateHistory}
                deleteHistoryChat={deleteHistoryChat}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null;
      })}
      <p className="dark:text-white/50 px-4 mt-4 text-xs text-gray-500">
        You have reached the end of your chat history.
      </p>
    </>
  ) : (
    <div className="dark:text-white/60 px-4 mt-3 text-sm text-gray-600">
      Your conversations will appear here once you start chatting!
    </div>
  );
};

export default SidebarHistoryContainer;
