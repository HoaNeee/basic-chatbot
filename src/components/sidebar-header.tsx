"use client";

import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const AppSidebarHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-neutral-600 dark:text-white/80 text-lg font-bold">
        Chatbot
      </h3>
      <Button
        size={"sm"}
        variant={"ghost"}
        onClick={() => {
          router.push("/");
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default AppSidebarHeader;
