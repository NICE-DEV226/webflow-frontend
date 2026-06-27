"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Sparkles, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveOnboardingPlan, type PlanTier } from "@/lib/api/tenants";
import { cn } from "@/lib/utils";

const PLANS: { tier: PlanTier; icon: typeof Zap; price: string; desc: string; features: string[] }[] = [
  {
    tier: "starter",
    icon: Shield,
    price: "$0 /mo",
    desc: "Plan.description.starter",
    features: [
      "Plan.features.claims100",
      "Plan.features.agents2",
      "Plan.features.brandedForm",
      "Plan.features.emailSupport",
    ],
  },
  {
    tier: "growth",
    icon: Zap,
    price: "$299 /mo",
    desc: "Plan.description.growth",
    features: [
      "Plan.features.claims1000",
      "Plan.features.agents10",
      "Plan.features.workflowConfig",
      "Plan.features.apiAccess",
      "Plan.features.prioritySupport",
    ],
  },
  {
    tier: "enterprise",
    icon: Sparkles,
    price: "$899 /mo",
    desc: "Plan.description.enterprise",
    features: [
      "Plan.features.unlimitedClaims",
      "Plan.features.unlimitedAgents",
      "Plan.features.customWorkflows",
      "Plan.features.dedicatedSupport",
      "Plan.features.whiteLabel",
      "Plan.features.sla",
    ],
  },
];

export function PlanStep({ sessionId, onNext, onBack }: { sessionId: string; onNext: () => void; onBack: () => void }) {
  const t = useTranslations("onboarding");
  const [selected, setSelected] = useState<PlanTier | null>(null);

  async function handleContinue() {
    if (!selected) return;
    try {
      await saveOnboardingPlan(sessionId, selected);
      onNext();
    } catch {
      // error handled by caller
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-primary">{t("plan.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("plan.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.tier;
          return (
            <button
              key={plan.tier}
              type="button"
              onClick={() => setSelected(plan.tier)}
              className={cn(
                "relative flex flex-col rounded-xl border-2 p-5 text-left transition-all hover:shadow-md",
                isSelected
                  ? "border-emerald bg-emerald/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30",
              )}
            >
              {plan.tier === "growth" && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-emerald px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  {t("plan.popular")}
                </span>
              )}
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  isSelected ? "bg-emerald text-white" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-3 text-lg font-bold capitalize text-primary">{plan.tier}</p>
              <p className="text-2xl font-bold text-primary">{plan.price}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(plan.desc)}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald" />
                    {t(f)}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button variant="outline" onClick={onBack}>
          {t("back")}
        </Button>
        <Button size="lg" disabled={!selected} onClick={handleContinue}>
          {t("plan.startTrial")}
        </Button>
      </div>
    </div>
  );
}
