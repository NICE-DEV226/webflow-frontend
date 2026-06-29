import { api } from "./client";

export interface NotificationOut {
  id: string;
  user_id: string;
  tenant_id: string | null;
  title: string;
  message: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(): Promise<NotificationOut[]> {
  return api.get<NotificationOut[]>("/auth/notifications");
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/auth/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/auth/notifications/read-all");
}
