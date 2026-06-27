"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { getAgents, type Agent } from "@/lib/api/agents";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

export default function AdminAgentsPage() {
  const t = useTranslations("adminPages.agents");
  const { user } = useAuth();

  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    if (user?.tenantSlug) {
      getAgents(user.tenantSlug).then(setAgents);
    }
  }, [user?.tenantSlug]);

  const sidebarUser = user
    ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
    : { name: "", email: "" };

  return (
    <AppShell
      role="admin"
      user={sidebarUser}
      title={t("title")}
      unread={3}
      actions={
        <button
          type="button"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus />
          {t("invite")}
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 text-left">{t("name")}</th>
                <th className="px-5 py-3 text-left">{t("email")}</th>
                <th className="px-5 py-3 text-left">{t("status")}</th>
                <th className="px-5 py-3 text-right">{t("handled")}</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => {
                const initials = a.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <tr key={a.email} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2.5">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {initials}
                        </span>
                        <span className="font-medium text-foreground">{a.name}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {a.email}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          a.active
                            ? "bg-emerald/10 text-emerald"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            a.active ? "bg-emerald" : "bg-muted-foreground",
                          )}
                        />
                        {a.active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-foreground">
                      {a.handled}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
