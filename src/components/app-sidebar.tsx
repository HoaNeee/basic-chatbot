import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import Histories from "./histories";
import NavUser from "./nav-user";
import AppSidebarHeader from "./sidebar-header";
import { cookies } from "next/headers";

const AppSideBar = async () => {
  const cookie = await cookies();

  const isGuest = cookie.get("is_guest")?.value === "true";

  return (
    <Sidebar>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <Histories />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isGuest={isGuest || false} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
