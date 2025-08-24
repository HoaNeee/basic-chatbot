"use client";

import { useChat } from "@/context/ChatContext";
import { useHistory } from "@/context/HistoryContext";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Histories = () => {
  const { state } = useHistory();

  const params = useParams();

  return (
    <div className="flex flex-col h-full gap-0 px-2 mt-3">
      {state.history.length > 0 ? (
        state.history.map((history) => (
          <div
            key={history._id}
            className={`relative cursor-pointer group/item`}
          >
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
            <div
              className={`hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm flex items-center justify-center size-5 absolute top-1/2 transform -translate-y-1/2 right-3 p-0.5 z-10 ${
                params.id === history._id
                  ? "opacity-80"
                  : "group-hover/item:opacity-100 opacity-0"
              } transition-opacity duration-200`}
              onClick={() => {
                console.log("option clicked");
              }}
            >
              <Ellipsis />
            </div>
          </div>
        ))
      ) : (
        <div className="dark:text-white/60 text-sm text-gray-600">
          Your conversations will appear here once you start chatting!
        </div>
      )}
    </div>
  );
};

export default Histories;
