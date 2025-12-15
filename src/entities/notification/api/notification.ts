import { api } from "@/entities/user/api/auth";

export interface Notification {
  id: number;
  user_id: number;
  type: "recommendation" | "alert" | "info";
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface NotificationCreate {
  type: string;
  title: string;
  message: string;
}

export const notificationApi = {
  // Get all notifications (with optional filter for unread only)
  getNotifications: async (unreadOnly: boolean = false) => {
    try {
      const response = await api.get<Notification[]>("/notifications/", {
        params: { unread_only: unreadOnly },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await api.get<{ unread_count: number }>(
        "/notifications/unread-count"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return { unread_count: 0 };
    }
  },

  // Get specific notification
  getNotification: async (id: number) => {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  // Create notification (for testing)
  create: async (notification: NotificationCreate) => {
    const response = await api.post<Notification>(
      "/notifications/",
      notification
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  // Delete notification
  delete: async (id: number) => {
    await api.delete(`/notifications/${id}`);
  },

  // Delete all notifications
  deleteAll: async () => {
    await api.delete("/notifications/");
  },
};
