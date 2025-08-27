import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import NavUser from "./nav-user";
import AppSidebarHeader from "./sidebar-header";
import { cookies } from "next/headers";
import SidebarHistoryContainer from "./sidebar-history-container";

const AppSideBar = async () => {
  const cookie = await cookies();

  const isGuest = cookie.get("is_guest")?.value === "true";

  return (
    <Sidebar>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistoryContainer />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isGuest={isGuest || false} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
