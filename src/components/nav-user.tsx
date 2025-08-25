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
import { useTheme } from "next-themes";
import Spinner from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";

const NavUser = ({ isGuest }: { isGuest: boolean }) => {
  const { state, logout } = useAuth();
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

  const renderLoading = () => {
    return (
      <SidebarMenuButton className="dark:bg-neutral-800 dark:text-gray-200 w-full py-5 text-gray-500 bg-white">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="flex-1 h-6" />
        <Spinner size="small" className="ml-auto" />
      </SidebarMenuButton>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-2">
        {state.loading ? (
          renderLoading()
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>{renderAvatar()}</DropdownMenuTrigger>
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
              {!isGuest ? (
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => router.push("/login")}>
                  Login to your account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
