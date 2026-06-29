"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowRight, CheckCircle, MapPin, Briefcase, Mail, Users, Palette, CreditCard, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CompanyFormData } from "@/components/onboarding/company-step";

interface ReviewStepProps {
  tenantId: string;
  company: CompanyFormData;
  plan: string | null;
  onChangePlan: () => void;
  onGoToDashboard?: () => void;
}

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  starter: { name: "Starter", price: "$0/mo" },
  growth: { name: "Growth", price: "$299/mo" },
  enterprise: { name: "Enterprise", price: "$899/mo" },
};

export function ReviewStep({ tenantId, company, plan, onChangePlan, onGoToDashboard }: ReviewStepProps) {
  const t = useTranslations("onboarding");
  const router = useRouter();

  const planInfo = plan ? PLAN_LABELS[plan] : null;

  function goToDashboard() {
    onGoToDashboard?.();
    router.push("/admin/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald/10">
          <CheckCircle className="size-8 text-emerald" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-primary">{t("review.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("review.subtitle")}</p>
      </div>

      {/* Company section */}
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <Briefcase className="size-4" />
          {t("review.companySection")}
        </h3>

        {company.logoPreview && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/30 p-3">
            <img
              src={company.logoPreview}
              alt="Logo"
              className="size-12 rounded-lg border object-contain bg-white"
            />
            <div>
              <p className="font-semibold text-primary">{company.name}</p>
              <p className="text-xs text-muted-foreground">{t("review.logo")}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Briefcase className="size-3" /> {t("review.name")}
            </p>
            <p className="mt-0.5 font-medium text-primary">{company.name}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="size-3" /> {t("review.email")}
            </p>
            <p className="mt-0.5 font-medium text-primary">{company.email}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {t("review.country")}
            </p>
            <p className="mt-0.5 font-medium text-primary">{company.countryLabel}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Briefcase className="size-3" /> {t("review.sector")}
            </p>
            <p className="mt-0.5 font-medium text-primary">{company.sectorLabel}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3" /> {t("review.agents")}
            </p>
            <p className="mt-0.5 font-medium text-primary">{company.agentCount || "—"}</p>
          </div>
        </div>
      </div>

      {/* Branding section */}
      <div className="mt-4 rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <Palette className="size-4" />
          {t("review.brandingSection")}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-8 rounded-lg border"
              style={{ backgroundColor: company.primaryColor }}
            />
            <span className="text-xs text-muted-foreground">{t("review.primaryColor")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-8 rounded-lg border"
              style={{ backgroundColor: company.secondaryColor }}
            />
            <span className="text-xs text-muted-foreground">{t("review.secondaryColor")}</span>
          </div>
        </div>
      </div>

      {/* Plan section */}
      <div className="mt-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            <CreditCard className="size-4" />
            {t("review.planSection")}
          </h3>
          <Button variant="outline" size="sm" onClick={onChangePlan} className="gap-1.5">
            <Pencil className="size-3.5" />
            {t("review.changePlan")}
          </Button>
        </div>
        {planInfo ? (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald/5 p-3">
            <div>
              <p className="font-semibold text-primary">{planInfo.name}</p>
              <p className="text-xs text-muted-foreground">{planInfo.price}</p>
            </div>
            <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald">
              14-day trial
            </span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{t("review.noPlan")}</p>
        )}
      </div>

      {/* Action */}
      <Button size="lg" className="mt-8 w-full" onClick={goToDashboard}>
        {t("review.goToDashboard")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
