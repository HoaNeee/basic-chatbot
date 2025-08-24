"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { ChevronUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useHistory } from "@/context/HistoryContext";
import { useTheme } from "next-themes";

const NavUser = ({ isGuest }: { isGuest: boolean }) => {
  const { state, logout } = useAuth();
  const { clearHistory } = useHistory();
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const renderAvatar = () => {
    const isLogin = !isGuest && state.user && state.user.email;

    return (
      <SidebarMenuButton className="dark:bg-neutral-800 dark:hover:bg-neutral-700 w-full py-5 bg-white">
        <Avatar className="">
          <AvatarImage></AvatarImage>
          <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
            {isLogin ? (
              <p className="font-bold capitalize">
                {state.user?.email?.charAt(0)}
              </p>
            ) : (
              <User className="size-4" />
            )}
          </AvatarFallback>
        </Avatar>{" "}
        <p className="text-ellipsis line-clamp-1">
          {isLogin ? state.user?.email : "Guest"}
        </p>
        <ChevronUp className="ml-auto" />
      </SidebarMenuButton>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-200">
            {renderAvatar()}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            style={{
              width: "var(--radix-popper-anchor-width)",
            }}
          >
            <DropdownMenuItem
              className=""
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              Toggle Theme to {theme === "dark" ? "Light" : "Dark"}
            </DropdownMenuItem>
            {isGuest ? (
              <>
                <DropdownMenuItem onClick={() => router.push("/login")}>
                  Login to your account
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    clearHistory();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
