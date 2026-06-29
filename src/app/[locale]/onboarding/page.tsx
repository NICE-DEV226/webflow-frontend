"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, CreditCard, PartyPopper } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { CompanyStep, type CompanyFormData } from "@/components/onboarding/company-step";
import { PlanStep } from "@/components/onboarding/plan-step";
import { ReviewStep } from "@/components/onboarding/review-step";
import { cn } from "@/lib/utils";

type Step = "company" | "plan" | "review";

const STEPS: { key: Step; icon: typeof Building2 }[] = [
  { key: "company", icon: Building2 },
  { key: "plan", icon: CreditCard },
  { key: "review", icon: PartyPopper },
];

const STEP_LABELS: Record<Step, string> = {
  company: "onboarding.steps.company",
  plan: "onboarding.steps.plan",
  review: "onboarding.steps.review",
};

const STORAGE_KEY = "claimflow_onboarding";

function saveState(step: Step, tenantId: string | null, companyData: CompanyFormData | null, selectedPlan: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, tenantId, companyData, selectedPlan }));
}

function loadState(): { step: Step; tenantId: string | null; companyData: CompanyFormData | null; selectedPlan: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export default function OnboardingPage() {
  const t = useTranslations();
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState<Step>("company");
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyFormData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.tenantId) {
      setStep(saved.step);
      setTenantId(saved.tenantId);
      if (saved.companyData) setCompanyData(saved.companyData);
      if (saved.selectedPlan) setSelectedPlan(saved.selectedPlan);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveState(step, tenantId, companyData, selectedPlan);
    }
  }, [step, tenantId, companyData, selectedPlan, loaded]);

  const currentIdx = STEPS.findIndex((s) => s.key === step);
  const progress = ((currentIdx + 1) / STEPS.length) * 100;

  function handleCompanyNext(data: { tenantId: string; company: CompanyFormData }) {
    setTenantId(data.tenantId);
    setCompanyData(data.company);
    setStep("plan");
  }

  function handlePlanNext(plan: string) {
    setSelectedPlan(plan);
    setStep("review");
  }

  function handleGoToDashboard() {
    clearState();
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-emerald" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Logo />
        <span className="text-xs text-muted-foreground">
          {t("onboarding.step")} {currentIdx + 1}/{STEPS.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="mx-auto mt-0 h-1 max-w-3xl">
        <div className="h-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                    isActive
                      ? "bg-emerald text-white"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-2 ring-emerald/30 ring-offset-2",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isActive ? "text-emerald" : "text-muted-foreground",
                  )}
                >
                  {t(STEP_LABELS[s.key])}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-px w-16",
                    i < currentIdx ? "bg-emerald" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <main className="mx-auto mt-8 max-w-3xl px-6 pb-16">
        {step === "company" && (
          <CompanyStep onNext={handleCompanyNext} />
        )}
        {step === "plan" && tenantId && (
          <PlanStep
            sessionId={tenantId}
            selectedPlan={selectedPlan}
            onNext={handlePlanNext}
            onBack={() => setStep("company")}
          />
        )}
        {step === "review" && tenantId && companyData && (
          <ReviewStep
            tenantId={tenantId}
            company={companyData}
            plan={selectedPlan}
            onChangePlan={() => setStep("plan")}
            onGoToDashboard={handleGoToDashboard}
          />
        )}
      </main>
    </div>
  );
}
