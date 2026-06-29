"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BellOff, Check, CheckCheck, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getNotifications, markAsRead, markAllAsRead, type NotificationOut } from "@/lib/api/notifications";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string, t: ReturnType<typeof useTranslations>): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minutesAgo", { minutes: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("hoursAgo", { hours });
  return t("daysAgo", { days: Math.floor(hours / 24) });
}

export function NotificationList() {
  const t = useTranslations("notifications");
  const [notifications, setNotifications] = useState<NotificationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  function fetch() {
    setLoading(true);
    getNotifications()
      .then((ns) => setNotifications(ns))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetch() }, []);

  async function handleMarkRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-emerald" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col items-center py-20">
          <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent text-primary">
            <BellOff className="size-7" />
          </span>
          <p className="text-lg font-semibold text-primary">{t("empty.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("empty.body")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} non ${unreadCount > 1 ? "lus" : "lu"}`
            : "Tout est lu"}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={markingAll}>
            <CheckCheck className="mr-1.5 size-4" />
            {t("markAllRead")}
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {notifications.map((n, i) => (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-3 px-5 py-4 transition-colors",
              !n.is_read && "bg-primary/[0.02]",
              i < notifications.length - 1 && "border-b",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-sm",
                    !n.is_read ? "font-semibold text-primary" : "text-muted-foreground",
                  )}
                >
                  {n.title}
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {timeAgo(n.created_at, t)}
                </span>
              </div>
              {n.message && (
                <p className="mt-0.5 text-xs text-muted-foreground/80">{n.message}</p>
              )}
              <div className="mt-2 flex items-center gap-3">
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className="flex items-center gap-1 text-[11px] font-medium text-emerald hover:underline"
                  >
                    <Check className="size-3" />
                    {t("markAsRead")}
                  </button>
                )}
                {n.link && (
                  <a
                    href={n.link}
                    className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    Voir
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
