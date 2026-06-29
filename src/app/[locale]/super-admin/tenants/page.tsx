"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformTenants, type TenantSummary } from "@/lib/api/platform";

export default function SuperAdminTenantsPage() {
  const t = useTranslations("superAdminPages.tenants");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [tenants, setTenants] = useState<TenantSummary[]>([]);

  useEffect(() => {
    getPlatformTenants().then(setTenants).catch(() => {});
  }, []);

  return (
    <AppShell
      role="superadmin"
      user={{ name: user?.email ?? "", email: user?.email ?? "" }}
      title={tNav("tenants")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      {tenants.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border py-20 text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("tenantId")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("activeTasks")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("overdueTasks")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("archivedTasks")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tenants.map((tenant) => (
                <tr key={tenant.tenant_id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{tenant.tenant_id}</td>
                  <td className="px-4 py-3">{tenant.active_tasks}</td>
                  <td className="px-4 py-3">
                    <span className={tenant.overdue_tasks > 0 ? "font-medium text-destructive" : ""}>
                      {tenant.overdue_tasks}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{tenant.archived_tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
