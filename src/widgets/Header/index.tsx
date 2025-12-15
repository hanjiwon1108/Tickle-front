"use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/shared/store/useAppStore";
import { useState } from "react";
import { NotificationPanel } from "@/features/notification/ui/NotificationPanel";
import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/entities/notification/api/notification";

export function Header() {
  const user = useAppStore((state) => state.user);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      const result = await notificationApi.getUnreadCount();
      return result.unread_count;
    },
    refetchInterval: 5000,
    enabled: !!user, // Only fetch if user is logged in
  });

  return (
    <>
      <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="검색..."
              className="w-full bg-muted/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors group"
          >
            <Bell size={20} className="group-hover:text-foreground" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </>
            )}
            {unreadCount === 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-muted-foreground rounded-full border-2 border-background" />
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary ring-2 ring-background" />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
