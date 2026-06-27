import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight, Clock, CheckCircle, Inbox } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { CLAIM_TYPE } from "@/lib/claim-type";
import { AGENT_QUEUE } from "@/lib/mock-claims";
import { cn } from "@/lib/utils";

const AGENT = { name: "Thomas Koné", email: "thomas@example.com" };

export default async function AgentQueuePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("agent");
  const tNav = await getTranslations("nav.agent");
  const tType = await getTranslations("claimForm.fields.claim_type.options");

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const kpis = [
    { label: t("kpi.processedToday"), value: "4", icon: CheckCircle, color: "#1D9E75" },
    { label: t("kpi.avgTime"), value: "6h 30", icon: Clock, color: "#F59E0B" },
    { label: t("kpi.approvalRate"), value: "91%", icon: Inbox, color: "#1E3A5F" },
  ];

  const tabs = [
    { label: t("tabs.all"), count: AGENT_QUEUE.length, active: true },
    { label: t("tabs.toReview"), count: 2, active: false },
    { label: t("tabs.inProgress"), count: 1, active: false },
    { label: t("tabs.done"), count: 47, active: false },
  ];

  return (
    <AppShell role="agent" user={AGENT} title={tNav("queue")} unread={AGENT_QUEUE.length}>
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${k.color}14`, color: k.color }}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-3 font-mono text-2xl font-bold text-primary tabular-nums">
                {k.value}
              </p>
              <p className="text-sm text-muted-foreground">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <span
            key={tab.label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
              tab.active
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border",
            )}
          >
            {tab.label}
            <span className={cn("text-xs", tab.active ? "opacity-80" : "opacity-60")}>
              {tab.count}
            </span>
          </span>
        ))}
      </div>

      {/* Queue */}
      <div className="mt-4 space-y-3">
        {AGENT_QUEUE.map((c) => {
          const type = CLAIM_TYPE[c.type];
          const TypeIcon = type.icon;
          return (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: type.bg, color: type.color }}
              >
                <TypeIcon className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {c.urgent && (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-destructive uppercase">
                      {t("queue.urgent")}
                    </span>
                  )}
                  <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {tType(c.type)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {c.claimant} · {c.receivedAgo}
                  {c.urgent && (
                    <span className="text-destructive"> · {t("queue.aboveThreshold")}</span>
                  )}
                </p>
              </div>

              <span className="font-mono text-base font-bold text-primary tabular-nums">
                {money(c.amount)}
              </span>

              <Link
                href={`/agent/claims/${c.id}`}
                className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
              >
                {t("queue.open")}
                <ChevronRight />
              </Link>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
