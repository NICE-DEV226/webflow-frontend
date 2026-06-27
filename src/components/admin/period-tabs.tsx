"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const OPTS = ["7d", "30d", "90d"] as const;

export function PeriodTabs() {
  const t = useTranslations("admin.period");
  const [active, setActive] = useState<(typeof OPTS)[number]>("30d");

  return (
    <div className="hidden rounded-lg border bg-card p-0.5 sm:inline-flex">
      {OPTS.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setActive(o)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            active === o
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(o)}
        </button>
      ))}
    </div>
  );
}
