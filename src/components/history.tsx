import Link from "next/link";
import React, { useState } from "react";
import { Edit2, Ellipsis, Trash2 } from "lucide-react";
import { TChat } from "@/types/Chat.types";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import AlertDialogDelete from "./alert-dialog-delete";
import { toast } from "sonner";

const History = ({
  history,
  deleteHistoryChat,
  updateHistory,
}: {
  history: TChat;
  deleteHistoryChat: (chatId: string) => Promise<void>;
  updateHistory: (chatId: string, history: Partial<TChat>) => Promise<void>;
}) => {
  const params = useParams();
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(history.title);

  return (
    <div key={history._id} className={`relative cursor-pointer group/item`}>
      {!isEditing ? (
        <Link
          className={`w-full p-2 transition-colors duration-200 rounded-sm hover:bg-neutral-200/40 dark:hover:bg-neutral-800 block ${
            params.id === history._id
              ? "bg-neutral-200/40 dark:bg-neutral-800 font-semibold"
              : "font-normal"
          }`}
          href={`/chat/${history._id}`}
          scroll={false}
        >
          <p className="text-ellipsis line-clamp-1 pr-7.5 text-sm">
            {history.title}
          </p>
        </Link>
      ) : (
        <input
          className="dark:bg-neutral-800 w-full p-2 text-sm transition-colors duration-200 bg-gray-100 rounded-sm outline-none"
          autoFocus
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setIsEditing(false);
              updateHistory(history._id, { title });
            }
          }}
          onBlur={() => {
            setIsEditing(false);
            updateHistory(history._id, { title });
          }}
          defaultValue={history.title || "Untitled"}
        />
      )}
      {!isEditing ? (
        <DropdownMenu open={openPopover} onOpenChange={setOpenPopover}>
          <DropdownMenuTrigger asChild>
            <div
              className={`hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm flex items-center justify-center size-5 absolute top-1/2 transform -translate-y-1/2 right-3 p-0.5 z-10 ${
                params.id === history._id || openPopover
                  ? "opacity-80"
                  : "group-hover/item:opacity-100 opacity-0"
              } transition-opacity duration-200`}
            >
              <Ellipsis />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit2 />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDialogDelete(true)}>
              <Trash2 className="text-destructive" />
              <span className="text-destructive">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <AlertDialogDelete
        open={openDialogDelete}
        onOpenChange={setOpenDialogDelete}
        onOK={() => {
          toast.promise(deleteHistoryChat(history._id), {
            loading: "Deleting chat...",
            success: "Chat deleted successfully",
            error: "Failed to delete chat",
          });
          if (history._id === params.id) {
            router.push("/");
          }
        }}
      />
    </div>
  );
};

export default History;
