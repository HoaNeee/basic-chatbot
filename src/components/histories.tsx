"use client";

import History from "./history";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { TChat } from "@/types/Chat.types";

interface HistoriesProps {
  histories: TChat[];
  deleteHistoryChat: (chatId: string) => Promise<void>;
  updateHistory: (chatId: string, updatedChat: Partial<TChat>) => Promise<void>;
}

const Histories = (props: HistoriesProps) => {
  const { histories, deleteHistoryChat, updateHistory } = props;

  return (
    <div className="flex flex-col gap-0 px-2 mt-0">
      <SidebarMenu className="gap-0">
        {histories?.map((history) => (
          <SidebarMenuItem key={history._id}>
            <History
              history={history}
              deleteHistoryChat={deleteHistoryChat}
              updateHistory={updateHistory}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
};

export default Histories;
