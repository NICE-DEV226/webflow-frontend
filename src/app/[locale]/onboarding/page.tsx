"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Building2, CreditCard, PartyPopper, Rocket } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { CompanyStep } from "@/components/onboarding/company-step";
import { PlanStep } from "@/components/onboarding/plan-step";
import { SuccessStep } from "@/components/onboarding/success-step";
import { Progress, ProgressIndicator } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Step = "company" | "plan" | "success";

const STEPS: { key: Step; icon: typeof Building2 }[] = [
  { key: "company", icon: Building2 },
  { key: "plan", icon: CreditCard },
  { key: "success", icon: PartyPopper },
];

const STEP_LABELS: Record<Step, string> = {
  company: "onboarding.steps.company",
  plan: "onboarding.steps.plan",
  success: "onboarding.steps.success",
};

export default function OnboardingPage() {
  const t = useTranslations();
  const [step, setStep] = useState<Step>("company");

  const currentIdx = STEPS.findIndex((s) => s.key === step);
  const progress = ((currentIdx + 1) / STEPS.length) * 100;

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
                  {t(s.key === step ? STEP_LABELS[s.key] : STEP_LABELS[s.key])}
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
        {step === "company" && <CompanyStep onNext={() => setStep("plan")} />}
        {step === "plan" && (
          <PlanStep
            onNext={() => setStep("success")}
            onBack={() => setStep("company")}
          />
        )}
        {step === "success" && <SuccessStep />}
      </main>
    </div>
  );
}
