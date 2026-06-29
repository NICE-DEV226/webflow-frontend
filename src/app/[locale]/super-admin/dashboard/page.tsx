"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, Layers, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformMetrics, type GlobalStats } from "@/lib/api/platform";

const METRICS = [
  { key: "total_tasks", icon: Layers, color: "bg-blue-500" },
  { key: "active_tenants", icon: Users, color: "bg-emerald-500" },
  { key: "archived_tasks", icon: CheckCircle2, color: "bg-amber-500" },
] as const;

export default function SuperAdminDashboardPage() {
  const t = useTranslations("superAdminPages.dashboard");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    getPlatformMetrics().then(setStats).catch(() => {});
  }, []);

  const statuses = stats?.by_status
    ? Object.entries(stats.by_status).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <AppShell
      role="superadmin"
      user={{ name: user?.email ?? "", email: user?.email ?? "" }}
      title={tNav("dashboard")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.key} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-lg ${m.color} text-white`}>
                <m.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {stats ? (stats as any)[m.key]?.toLocaleString() ?? "—" : "—"}
                </p>
                <p className="text-xs text-muted-foreground">{t(m.key)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {statuses.length > 0 && (
        <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4" />
            {t("byStatus")}
          </h3>
          <div className="space-y-2">
            {statuses.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm capitalize text-muted-foreground">{status.replace(/_/g, " ")}</span>
                <span className="text-sm font-medium">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
