"use client";

import { motion, useReducedMotion } from "motion/react";
import { Car, Check, Wifi } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { Lottie } from "@/components/lottie/lottie";
import { StatusBadge } from "@/components/claim/status-badge";
import { CLAIM_FLOW_ORDER, CLAIM_STATUS } from "@/lib/claim-status";

const EVENTS = [
  { label: "claim.submitted", t: "14:32" },
  { label: "auto-approved", t: "14:33" },
  { label: "payment.succeeded", t: "16:46" },
];

/**
 * Aperçu produit du hero — montre un dossier réel "vivant" (statut, montants, ledger).
 * Motion : entrée + flottement doux + ticker échelonné (désactivés si reduced-motion).
 * Le ✓ animé (Lottie) reste le seul moment d'animation "contenu".
 */
export function HeroArt() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md">
      {/* halo */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-emerald/10 blur-2xl" />

      <motion.div
        suppressHydrationWarning
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          suppressHydrationWarning
          className="relative"
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Animated "approved" stamp — owns the top-right corner */}
          <div className="absolute -top-4 -right-4 z-20 size-20 drop-shadow-lg">
            <Lottie
              src="/animations/approved.lottie"
              className="size-full"
              respectReducedMotion={false}
              aria-label="Approved"
              fallback={
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald text-white">
                  <Check className="size-7" strokeWidth={3} />
                </div>
              }
            />
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-xl">
            {/* header */}
            <div className="mb-4 flex items-center gap-2">
              <LogoMark className="size-7 text-primary" />
              <span className="font-mono text-xs font-medium tracking-wide text-muted-foreground">
                claim
              </span>
            </div>

            {/* claim card */}
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#6366F1]">
                    <Car className="size-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      CLM-2026-0043
                    </p>
                    <p className="text-sm font-semibold text-foreground">$4,500</p>
                  </div>
                </div>
                <StatusBadge status="paid" />
              </div>

              {/* progress dots */}
              <div className="mt-4 flex items-center gap-1.5">
                {CLAIM_FLOW_ORDER.filter((s) => s !== "under_review").map((s) => (
                  <span
                    key={s}
                    className="h-1.5 flex-1 rounded-full"
                    style={{ backgroundColor: CLAIM_STATUS[s].fg }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Reimbursed in{" "}
                <span className="font-medium text-emerald">2h 14m</span>
              </p>
            </div>

            {/* event ticker (staggered) */}
            <motion.div
              suppressHydrationWarning
              className="mt-3 space-y-2"
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
              }}
            >
              {EVENTS.map((e) => (
                <motion.div
                  suppressHydrationWarning
                  key={e.label}
                  className="flex items-center justify-between text-xs"
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald" />
                    <span className="font-mono">{e.label}</span>
                  </span>
                  <span className="font-mono text-muted-foreground/70">{e.t}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* live footer */}
            <div className="mt-4 flex items-center gap-1.5 border-t pt-3 text-[11px] font-medium text-emerald">
              <Wifi className="size-3 animate-pulse" />
              Real-time updates
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
