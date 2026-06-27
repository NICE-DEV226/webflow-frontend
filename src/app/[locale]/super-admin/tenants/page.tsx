"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { getPlatformTenants, suspendTenant, activateTenant, type PlatformTenant } from "@/lib/api/platform";

export default function SuperAdminTenantsPage() {
  const t = useTranslations("superAdminPages.tenants");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [tenants, setTenants] = useState<PlatformTenant[]>([]);

  useEffect(() => {
    getPlatformTenants().then(setTenants).catch(() => {});
  }, []);

  async function handleToggle(tenant: PlatformTenant) {
    try {
      if (tenant.status === "active") {
        await suspendTenant(tenant.slug);
      } else {
        await activateTenant(tenant.slug);
      }
      setTenants((prev) =>
        prev.map((t) =>
          t.slug === tenant.slug
            ? { ...t, status: t.status === "active" ? "suspended" : "active" }
            : t,
        ),
      );
      toast.success(tenant.status === "active" ? t("suspended") : t("activated"));
    } catch {
      toast.error("Failed to update tenant");
    }
  }

  return (
    <AppShell
      role="superadmin"
      user={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email ?? "" }}
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
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("slug")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("name")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("plan")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("status")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tenants.map((tenant) => (
                <tr key={tenant.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{tenant.slug}</td>
                  <td className="px-4 py-3 font-medium">{tenant.name}</td>
                  <td className="px-4 py-3 capitalize">{tenant.plan}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tenant.status === "active"
                          ? "bg-emerald/10 text-emerald"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {tenant.status === "active" ? t("active") : t("suspended")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant={tenant.status === "active" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(tenant)}
                    >
                      {tenant.status === "active" ? t("suspend") : t("activate")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
