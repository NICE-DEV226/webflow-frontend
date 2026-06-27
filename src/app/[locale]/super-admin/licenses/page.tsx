"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformLicenses, type PlatformLicense } from "@/lib/api/platform";

export default function SuperAdminLicensesPage() {
  const t = useTranslations("superAdminPages.licenses");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [licenses, setLicenses] = useState<PlatformLicense[]>([]);

  useEffect(() => {
    getPlatformLicenses().then(setLicenses).catch(() => {});
  }, []);

  return (
    <AppShell
      role="superadmin"
      user={{ name: `${user?.firstName} ${user?.lastName}`, email: user?.email ?? "" }}
      title={tNav("licenses")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("tenant")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("plan")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("status")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("trialEnds")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {licenses.map((lic) => (
              <tr key={lic.tenantSlug} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{lic.tenantName}</td>
                <td className="px-4 py-3 capitalize">{lic.plan}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      lic.status === "active"
                        ? "bg-emerald/10 text-emerald"
                        : lic.status === "trial"
                          ? "bg-amber/10 text-amber"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {lic.status === "active"
                      ? t("active")
                      : lic.status === "trial"
                        ? t("trial")
                        : t("expired")}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(lic.trialEndsAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
