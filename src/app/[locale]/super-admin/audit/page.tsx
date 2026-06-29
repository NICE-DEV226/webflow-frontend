"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformAudit, type ActorAudit } from "@/lib/api/platform";

export default function SuperAdminAuditPage() {
  const t = useTranslations("superAdminPages.audit");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const userId = user?.id;
  const [audit, setAudit] = useState<ActorAudit | null>(null);

  useEffect(() => {
    if (!userId) return;
    getPlatformAudit(userId).then(setAudit).catch(() => {});
  }, [userId]);

  const actionEntries = audit?.actions
    ? Object.entries(audit.actions).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <AppShell
      role="superadmin"
      user={{ name: user?.email ?? "", email: user?.email ?? "" }}
      title={tNav("audit")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      {!audit ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border py-20 text-center">
          <Shield className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">{audit.total_actions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t("totalActions")}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">{audit.soft_deleted_comments.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t("softDeletedComments")}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">{actionEntries.length}</p>
            <p className="text-xs text-muted-foreground">{t("uniqueActions")}</p>
          </div>
        </div>
      )}

      {actionEntries.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("action")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("count")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {actionEntries.map(([action, count]) => (
                <tr key={action} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{action}</code>
                  </td>
                  <td className="px-4 py-3 font-medium">{count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
