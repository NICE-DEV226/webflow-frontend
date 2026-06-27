"use client";

import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth-provider";

export default function AdminLicensePage() {
  const t = useTranslations("adminPages.license");
  const { user } = useAuth();

  const sidebarUser = user
    ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
    : { name: "", email: "" };

  const usage = [
    { label: t("claimsUsage"), used: 142, limit: 200 },
    { label: t("agentsUsage"), used: 3, limit: 5 },
  ];

  return (
    <AppShell role="admin" user={sidebarUser} title={t("title")} unread={3}>
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        {/* Current plan */}
        <div className="rounded-xl border bg-primary p-6 text-primary-foreground shadow-sm">
          <p className="text-xs text-primary-foreground/70">{t("current")}</p>
          <p className="mt-1 text-2xl font-bold">Starter</p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {t("trial", { days: 8 })}
          </p>
          <Button variant="success" className="mt-5 w-full">
            {t("upgrade")}
          </Button>
        </div>

        {/* Usage */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{t("usage")}</h2>
          <div className="mt-4 space-y-5">
            {usage.map((u) => (
              <div key={u.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="font-mono tabular-nums text-foreground">
                    {u.used}/{u.limit}
                  </span>
                </div>
                <Progress value={(u.used / u.limit) * 100} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
