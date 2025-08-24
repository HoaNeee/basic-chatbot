import React from "react";
import SidebarButtonToggle from "./sidebar-button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-2">
      <SidebarButtonToggle />
    </header>
  );
};

export default Header;
