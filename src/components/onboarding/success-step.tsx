"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CheckCircle, ArrowRight, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { completeOnboarding, type ExtendedTenant } from "@/lib/mock-tenants";

export function SuccessStep() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [tenant, setTenant] = useState<ExtendedTenant | null>(null);

  useEffect(() => {
    const result = completeOnboarding();
    setTenant(result);
  }, []);

  function goToDashboard() {
    router.push("/admin/dashboard");
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-emerald" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-8 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald/10">
        <PartyPopper className="size-8 text-emerald" />
      </span>

      <h2 className="mt-6 text-2xl font-bold text-primary">{t("success.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("success.subtitle")}</p>

      <div className="mt-8 rounded-xl border bg-card p-6 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle className="size-6 text-emerald" />
          <div>
            <p className="font-semibold text-primary">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">{t("success.tenantCreated")}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("success.plan")}</p>
            <p className="mt-0.5 font-semibold capitalize text-primary">{tenant.plan}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{t("success.trial")}</p>
            <p className="mt-0.5 font-semibold text-primary">
              {new Date(tenant.trialEndsAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-primary/5 p-3">
          <p className="text-xs text-muted-foreground">{t("success.slug")}</p>
          <p className="mt-0.5 font-mono text-sm font-medium text-primary">{tenant.slug}.claimflow.com</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald/20 bg-emerald/5 p-4 text-left">
        <p className="text-sm font-medium text-emerald">{t("success.guideTitle")}</p>
        <ul className="mt-2 space-y-1.5">
          {[
            t("success.guide1"),
            t("success.guide2"),
            t("success.guide3"),
            t("success.guide4"),
            t("success.guide5"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-emerald/20 text-[10px] font-bold text-emerald">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Button size="lg" className="mt-8 w-full" onClick={goToDashboard}>
        {t("success.goToDashboard")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
