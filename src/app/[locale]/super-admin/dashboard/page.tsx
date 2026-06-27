"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, CreditCard, FileText, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformMetrics, type PlatformMetrics } from "@/lib/api/platform";

const METRICS = [
  { key: "totalTenants", icon: Building2, color: "bg-blue-500" },
  { key: "totalClaims", icon: FileText, color: "bg-emerald-500" },
  { key: "activeUsers", icon: Users, color: "bg-amber-500" },
  { key: "monthlyRevenue", icon: CreditCard, color: "bg-violet-500" },
] as const;

export default function SuperAdminDashboardPage() {
  const t = useTranslations("superAdminPages.dashboard");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);

  useEffect(() => {
    getPlatformMetrics().then(setMetrics).catch(() => {});
  }, []);

  return (
    <AppShell
      role="superadmin"
      user={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email ?? "" }}
      title={tNav("dashboard")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.key} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-lg ${m.color} text-white`}>
                <m.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {metrics ? (metrics as any)[m.key]?.toLocaleString() ?? "—" : "—"}
                </p>
                <p className="text-xs text-muted-foreground">{t(m.key)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
