"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SidebarButtonToggle = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={"outline"} size={"icon"} onClick={toggleSidebar}>
          <PanelLeft className="text-neutral-600 size-5 dark:text-white/80" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Sidebar</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarButtonToggle;
