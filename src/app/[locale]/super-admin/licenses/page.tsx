"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth-provider";
import { getPlatformLicenses, type LicensePlan } from "@/lib/api/platform";

export default function SuperAdminLicensesPage() {
  const t = useTranslations("superAdminPages.licenses");
  const tNav = useTranslations("nav.superadmin");
  const { user } = useAuth();

  const [plans, setPlans] = useState<LicensePlan[]>([]);

  useEffect(() => {
    getPlatformLicenses().then(setPlans).catch(() => {});
  }, []);

  return (
    <AppShell
      role="superadmin"
      user={{ name: user?.email ?? "", email: user?.email ?? "" }}
      title={tNav("licenses")}
    >
      <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      {plans.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border py-20 text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold">
                {plan.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/mois</span>
              </p>
              {plan.description && (
                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>
              )}
              <div className="mt-4 space-y-1 text-sm">
                <p className="text-muted-foreground">
                  {t("maxUsers")}: <span className="font-medium text-primary">{plan.max_users}</span>
                </p>
                <p className="text-muted-foreground">
                  {t("type")}: <span className="font-medium capitalize">{plan.type.toLowerCase()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
