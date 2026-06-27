"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformAudit, type PlatformAuditEvent } from "@/lib/api/platform";

export default function SuperAdminAuditPage() {
  const t = useTranslations("superAdminPages.audit");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [events, setEvents] = useState<PlatformAuditEvent[]>([]);

  useEffect(() => {
    getPlatformAudit().then(setEvents).catch(() => {});
  }, []);

  return (
    <AppShell
      role="superadmin"
      user={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email ?? "" }}
      title={tNav("audit")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      {events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border py-20 text-center">
          <Shield className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Tenant</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("actor")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("action")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("target")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("when")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((ev, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {ev.tenantSlug ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{ev.actor}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{ev.action}</code>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{ev.target}</td>
                  <td className="px-4 py-3 text-muted-foreground">{ev.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
