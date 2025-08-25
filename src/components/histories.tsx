"use client";

import { useHistory } from "@/context/HistoryContext";
import { Skeleton } from "./ui/skeleton";
import History from "./history";
import { useEffect } from "react";
import { toast } from "sonner";

const Histories = () => {
  const { state, deleteHistoryChat, updateHistory } = useHistory();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  const renderLoading = () => {
    return (
      <div className="flex flex-col h-full gap-3 pr-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="w-full h-6" key={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-0 px-2 mt-3">
      {state.loading ? (
        renderLoading()
      ) : state.history.length > 0 ? (
        <div>
          {state.history.map((history) => (
            <History
              key={history._id}
              history={history}
              deleteHistoryChat={deleteHistoryChat}
              updateHistory={updateHistory}
            />
          ))}
          <p className="dark:text-white/50 px-4 mt-8 text-xs text-gray-500">
            You have reached the end of your chat history.
          </p>
        </div>
      ) : (
        <div className="dark:text-white/60 text-sm text-gray-600">
          Your conversations will appear here once you start chatting!
        </div>
      )}
    </div>
  );
};

export default Histories;
