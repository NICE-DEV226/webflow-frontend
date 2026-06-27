"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CLAIM_FLOW_ORDER, CLAIM_STATUS, type ClaimStatus } from "@/lib/claim-status";

/**
 * Stepper linéaire CLIQUABLE d'UN sinistre (vue assuré).
 * - Étapes atteintes = cliquables → ouvrent un aperçu des vraies données de l'étape.
 * - Suit la progression live (se resynchronise sur l'étape courante).
 * - Responsive (flex-1), aucun débordement. ≠ graphe n8n (réservé marketing/admin).
 */
export function ClaimProgressSteps({
  currentStatus,
  claimId,
  amount,
  currency,
  agentName = "Thomas Koné",
  paymentRef = "pi_3Qk7Zx2eZvKYlo2C",
  className,
}: {
  currentStatus: ClaimStatus;
  claimId: string;
  amount: number;
  currency: string;
  agentName?: string;
  paymentRef?: string;
  className?: string;
}) {
  const ts = useTranslations("claimStatus");
  const ti = useTranslations("stepInfo");
  const td = useTranslations("claimDetail");
  const tp = useTranslations("payment");
  const locale = useLocale();

  const steps = CLAIM_FLOW_ORDER;
  const curIdx = Math.max(0, steps.indexOf(currentStatus));
  const [selected, setSelected] = useState<ClaimStatus>(currentStatus);

  // Suit la progression live (l'utilisateur peut cliquer une étape passée entre deux mises à jour).
  useEffect(() => setSelected(currentStatus), [currentStatus]);

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  const detailText: Record<ClaimStatus, string> = {
    draft: ti("submitted"),
    submitted: ti("submitted"),
    under_review: ti("under_review"),
    evaluation: ti("evaluation", { agent: agentName }),
    approved: ti("approved", { amount: money(amount) }),
    rejected: ti("closed"),
    paid: ti("paid"),
    closed: ti("closed"),
  };

  const SelIcon = CLAIM_STATUS[selected].icon;

  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>
      {/* Steps row */}
      <div className="flex items-start">
        {steps.map((s, i) => {
          const done = i < curIdx;
          const current = i === curIdx;
          const isReached = i <= curIdx;
          const isSel = s === selected;
          const Icon = CLAIM_STATUS[s].icon;
          return (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i === 0 ? "opacity-0" : done || current ? "bg-emerald" : "bg-border",
                  )}
                />
                <button
                  type="button"
                  disabled={!isReached}
                  onClick={() => setSelected(s)}
                  aria-label={ts(s)}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition",
                    done
                      ? "border-emerald bg-emerald text-white"
                      : current
                        ? "border-emerald bg-emerald/10 text-emerald"
                        : "border-border bg-card text-muted-foreground",
                    isReached ? "cursor-pointer hover:scale-110" : "cursor-default",
                    isSel && "ring-2 ring-emerald ring-offset-2 ring-offset-card",
                  )}
                >
                  {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                </button>
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i === steps.length - 1 ? "opacity-0" : done ? "bg-emerald" : "bg-border",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 text-center text-[10px] leading-tight sm:text-xs",
                  current || isSel ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {ts(s)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detail of the selected step — miniature of real data */}
      <div className="mt-5 rounded-lg border bg-background p-4">
        <div className="flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-md"
            style={{
              backgroundColor: CLAIM_STATUS[selected].bg,
              color: CLAIM_STATUS[selected].fg,
            }}
          >
            <SelIcon className="size-4" />
          </span>
          <p className="text-sm font-semibold text-foreground">{ts(selected)}</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{detailText[selected]}</p>

        {selected === "paid" && (
          <div className="mt-3 rounded-md bg-card p-3">
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tp("amount")}</dt>
                <dd className="font-mono text-foreground">{money(amount)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tp("reference")}</dt>
                <dd className="font-mono text-foreground">{paymentRef}</dd>
              </div>
            </dl>
            <Link
              href={`/dashboard/claims/${claimId}/payment`}
              className={cn(buttonVariants({ variant: "success", size: "sm" }), "mt-3 w-full")}
            >
              {td("viewPayout")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
