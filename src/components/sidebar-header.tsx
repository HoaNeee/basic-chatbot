"use client";

import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const AppSidebarHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-neutral-600 dark:text-white/80 text-lg font-bold">
        Chatbot
      </h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={() => {
              router.push("/");
            }}
          >
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new chat</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default AppSidebarHeader;
