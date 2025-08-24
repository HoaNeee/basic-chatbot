"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

const SidebarButtonToggle = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant={"outline"} size={"icon"} onClick={toggleSidebar}>
      <PanelLeft className="text-neutral-600 size-5 dark:text-white/80" />
    </Button>
  );
};

export default SidebarButtonToggle;
