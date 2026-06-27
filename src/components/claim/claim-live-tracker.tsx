"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Play, RotateCcw, Wifi } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/claim/status-badge";
import { ClaimProgressSteps } from "@/components/claim/claim-progress-steps";
import { CLAIM_STATUS, type ClaimStatus } from "@/lib/claim-status";
import { CLAIM_TYPE, type ClaimType } from "@/lib/claim-type";

const PATH: ClaimStatus[] = [
  "submitted",
  "under_review",
  "evaluation",
  "approved",
  "paid",
  "closed",
];

interface TimelineEvent {
  status: ClaimStatus;
  actor: "you" | "system";
  ts: number;
}

export function ClaimLiveTracker({
  id,
  type,
  amount,
  currency,
  dateISO,
}: {
  id: string;
  type: ClaimType;
  amount: number;
  currency: string;
  dateISO: string;
}) {
  const t = useTranslations("claimDetail");
  const ts = useTranslations("claimStatus");
  const tType = useTranslations("claimForm.fields.claim_type.options");
  const locale = useLocale();

  const baseTime = new Date(`${dateISO}T14:32:00`).getTime();
  const [current, setCurrent] = useState<ClaimStatus>("submitted");
  const [events, setEvents] = useState<TimelineEvent[]>([
    { status: "submitted", actor: "you", ts: baseTime },
  ]);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  const time = (ms: number) =>
    new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(ms);

  const reached = (s: ClaimStatus) => PATH.indexOf(current) >= PATH.indexOf(s);

  // Applique une mise à jour de statut, qu'elle vienne du SSE réel ou de la simulation.
  const applyStatus = useCallback(
    (st: ClaimStatus, actor: "you" | "system") => {
      setCurrent(st);
      setEvents((e) =>
        e.some((x) => x.status === st)
          ? e
          : [...e, { status: st, actor, ts: Date.now() }],
      );
      toast.success(`${ts(st)} · ${t("toastUpdate")}`);
    },
    [ts, t],
  );

  // Vrai temps réel : EventSource sur le canal XPulse du sinistre (si l'API est configurée).
  // En démo (pas d'API), on retombe sur le bouton "Simuler".
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    const es = new EventSource(
      `${base}/notifications/stream?channels=claim:${id}`,
    );
    es.onmessage = (ev) => {
      try {
        const d = JSON.parse(ev.data);
        const st = (d.status ?? d.data?.status) as ClaimStatus | undefined;
        if (st && PATH.includes(st)) applyStatus(st, "system");
      } catch {
        /* message non-JSON ignoré */
      }
    };
    es.onerror = () => {
      /* EventSource se reconnecte seul ; en démo sans backend, on ignore */
    };
    return () => es.close();
  }, [id, applyStatus]);

  function play() {
    if (running) return;
    const rest = PATH.slice(PATH.indexOf(current) + 1);
    if (rest.length === 0) return;
    setRunning(true);
    rest.forEach((st, i) => {
      const tid = window.setTimeout(
        () => {
          applyStatus(st, "system");
          if (i === rest.length - 1) setRunning(false);
        },
        (i + 1) * 1500,
      );
      timers.current.push(tid);
    });
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setCurrent("submitted");
    setEvents([{ status: "submitted", actor: "you", ts: baseTime }]);
  }

  const typeMeta = CLAIM_TYPE[type];
  const TypeIcon = typeMeta.icon;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: typeMeta.bg, color: typeMeta.color }}
            >
              <TypeIcon className="size-5" />
            </span>
            <div>
              <p className="font-mono text-xs text-muted-foreground">{id}</p>
              <p className="font-semibold text-foreground">{tType(type)}</p>
              <p className="text-xs text-muted-foreground">
                {t("submittedOn")}{" "}
                {new Intl.DateTimeFormat(locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(dateISO))}
              </p>
            </div>
          </div>
          <StatusBadge status={current} />
        </div>

        {/* Amounts */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">{t("amounts.claimed")}</p>
            <p className="font-semibold text-foreground">{money(amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("amounts.approved")}</p>
            <p className="font-semibold text-foreground">
              {reached("approved") ? money(amount) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("amounts.reimbursed")}</p>
            <p className="font-semibold text-emerald">
              {reached("paid") ? money(amount) : "—"}
            </p>
          </div>
        </div>

        {reached("paid") && (
          <Link
            href={`/dashboard/claims/${id}/payment`}
            className={cn(buttonVariants({ variant: "success" }), "mt-4 w-full")}
          >
            {t("viewPayout")}
          </Link>
        )}
      </div>

      {/* Live controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1.5 text-xs font-medium text-emerald">
          <Wifi className="size-3.5 animate-pulse" />
          {running ? t("live.running") : t("live.on")}
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={play} disabled={running || current === "closed"}>
            <Play />
            {t("live.play")}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw />
            {t("live.reset")}
          </Button>
        </div>
      </div>

      {/* Progress steps (vue assuré — linéaire, cliquable, aperçu des données) */}
      <ClaimProgressSteps
        currentStatus={current}
        claimId={id}
        amount={amount}
        currency={currency}
      />

      {/* Timeline */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          {t("timelineTitle")}
        </h2>
        <ol className="space-y-4">
          {[...events].reverse().map((ev, i) => {
            const meta = CLAIM_STATUS[ev.status];
            const Icon = meta.icon;
            return (
              <li key={`${ev.status}-${i}`} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: meta.bg, color: meta.fg }}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {ts(ev.status)}
                    </p>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {time(ev.ts)}
                    </time>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(`actor.${ev.actor}`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
