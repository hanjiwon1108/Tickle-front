"use client";

import { useQuery } from "@tanstack/react-query";
import {
  notificationApi,
  Notification,
} from "@/entities/notification/api/notification";
import { useAppStore } from "@/shared/store/useAppStore";
import {
  Bell,
  Trash2,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  Gift,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// 시간 차이를 한글로 표시하는 함수
function formatTimeAgo(date: string): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;
  return notificationDate.toLocaleDateString("ko-KR");
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const user = useAppStore((state) => state.user);
  const [selectedNotification, setSelectedNotification] = useState<
    number | null
  >(null);

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications(),
    refetchInterval: 5000, // Refetch every 5 seconds
    enabled: isOpen && !!user, // Only fetch when panel is open AND user is logged in
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      const result = await notificationApi.getUnreadCount();
      return result.unread_count;
    },
    refetchInterval: 5000,
    enabled: !!user, // Only fetch when user is logged in
  });

  const handleMarkAsRead = async (id: number) => {
    await notificationApi.markAsRead(id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    refetch();
  };

  const handleDelete = async (id: number) => {
    await notificationApi.delete(id);
    refetch();
  };

  const handleDeleteAll = async () => {
    if (confirm("모든 알림을 삭제하시겠습니까?")) {
      await notificationApi.deleteAll();
      refetch();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Gift size={16} className="text-blue-500" />;
      case "alert":
        return <AlertCircle size={16} className="text-red-500" />;
      case "info":
      default:
        return <Info size={16} className="text-green-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "bg-blue-50";
      case "alert":
        return "bg-red-50";
      case "info":
      default:
        return "bg-green-50";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-background/50 backdrop-blur-xl sticky top-0">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <div>
                  <h2 className="font-semibold text-lg">알림</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {unreadCount}개의 읽지 않은 알림
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2
                    className="animate-spin text-muted-foreground"
                    size={24}
                  />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <AlertCircle size={40} className="text-red-500" />
                  <p className="text-muted-foreground font-medium">
                    알림을 불러올 수 없습니다
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {error instanceof Error
                      ? error.message
                      : "알 수 없는 오류가 발생했습니다"}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-sm"
                  >
                    다시 시도
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <Bell size={40} className="text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium">
                    알림이 없습니다
                  </p>
                  <p className="text-xs text-muted-foreground">
                    새로운 알림이 있으면 여기에 표시됩니다
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 cursor-pointer transition-all hover:bg-muted/50 ${getBackgroundColor(
                        notification.type
                      )} ${
                        notification.is_read === 0
                          ? "opacity-100"
                          : "opacity-75"
                      }`}
                      onClick={() => {
                        setSelectedNotification(notification.id);
                        if (notification.is_read === 0) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm leading-tight">
                              {notification.title}
                            </h3>
                            {notification.is_read === 0 && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1 hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2
                            size={16}
                            className="text-muted-foreground hover:text-destructive"
                          />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border px-6 py-4 flex gap-2 bg-background/50 backdrop-blur-xl sticky bottom-0">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <CheckCheck size={16} />
                  모두 읽음
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  모두 삭제
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
