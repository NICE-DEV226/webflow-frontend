"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  AlertTriangle,
  Banknote,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/claim/status-badge";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { PeriodTabs } from "@/components/admin/period-tabs";
import { CLAIM_STATUS } from "@/lib/claim-status";
import { CLAIM_TYPE } from "@/lib/claim-type";
import {
  getAdminStatusDistribution,
  getAdminVolume,
  getAdminRecentClaims,
  type StatusDistribution,
  type VolumeDataPoint,
  type RecentClaim,
} from "@/lib/api/claims";
import { useAuth } from "@/components/auth-provider";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const tNav = useTranslations("nav.admin");
  const ts = useTranslations("claimStatus");
  const tType = useTranslations("claimForm.fields.claim_type.options");
  const tTable = useTranslations("dashboard.claimant.table");
  const locale = useLocale();
  const { user } = useAuth();

  const [recent, setRecent] = useState<RecentClaim[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistribution[]>([]);
  const [volume, setVolume] = useState<VolumeDataPoint[]>([]);

  useEffect(() => {
    getAdminRecentClaims().then(setRecent);
    getAdminStatusDistribution().then(setStatusDist);
    getAdminVolume().then(setVolume);
  }, []);

  const sidebarUser = user
    ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
    : { name: "", email: "" };

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const totalClaims = statusDist.reduce((sum, d) => sum + d.value, 0);

  const kpis = [
    { label: t("kpi.totalClaims"), value: String(totalClaims), icon: FileText, color: "#1E3A5F", trend: { up: true, good: true, text: "+12%" } },
    { label: t("kpi.avgTime"), value: "18h 24m", icon: Clock, color: "#F59E0B", trend: { up: false, good: true, text: "-2h" } },
    { label: t("kpi.approvalRate"), value: "87%", icon: CheckCircle, color: "#1D9E75", trend: { up: true, good: true, text: "+3%" } },
    { label: t("kpi.totalReimbursed"), value: money(94200), icon: Banknote, color: "#1E3A5F", trend: null },
  ];

  const segments = statusDist.map((d) => ({
    label: ts(d.status),
    value: d.value,
    color: CLAIM_STATUS[d.status].fg,
  }));

  return (
    <AppShell
      role="admin"
      user={sidebarUser}
      title={tNav("dashboard")}
      unread={3}
      actions={<PeriodTabs />}
    >
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${k.color}14`, color: k.color }}
                >
                  <Icon className="size-5" />
                </span>
                {k.trend && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      k.trend.good ? "text-emerald" : "text-destructive"
                    }`}
                  >
                    {k.trend.up ? (
                      <TrendingUp className="size-3.5" />
                    ) : (
                      <TrendingDown className="size-3.5" />
                    )}
                    {k.trend.text}
                  </span>
                )}
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-primary tabular-nums">
                {k.value}
              </p>
              <p className="text-sm text-muted-foreground">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-foreground">
            {t("charts.volume")}
          </h2>
          <BarChart data={volume.map((d) => d.count)} />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-foreground">
            {t("charts.distribution")}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
            <DonutChart
              segments={segments}
              centerValue={String(totalClaims)}
              centerLabel={t("charts.totalLabel")}
            />
            <ul className="space-y-2.5">
              {segments.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-foreground">{s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alerts + License */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-l-4 border-l-warning bg-card p-4 shadow-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="text-sm text-foreground">{t("alerts.overdue", { count: 3 })}</p>
            <Link href="/admin/claims" className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-emerald hover:underline">
              {t("alerts.review")}
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-l-4 border-l-info bg-card p-4 shadow-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-info" />
          <div className="flex-1">
            <p className="text-sm text-foreground">
              {t("alerts.quota", { used: totalClaims, limit: 200, percent: Math.round((totalClaims / 200) * 100) })}
            </p>
            <Link href="/admin/license" className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-emerald hover:underline">
              {t("alerts.upgrade")}
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-primary p-4 text-primary-foreground shadow-sm">
          <p className="text-xs text-primary-foreground/70">{t("license.title")}</p>
          <p className="mt-1 text-lg font-bold">Starter</p>
          <p className="text-xs text-primary-foreground/80">{t("license.trialLeft", { days: 8 })}</p>
          <Link
            href="/admin/license"
            className={`${buttonVariants({ variant: "success", size: "sm" })} mt-3 w-full`}
          >
            {t("license.activate")}
          </Link>
        </div>
      </div>

      {/* Recent claims */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <h2 className="border-b px-5 py-4 text-sm font-semibold text-foreground">
          {t("recent.title")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 text-left">{tTable("id")}</th>
                <th className="px-5 py-3 text-left">{tTable("type")}</th>
                <th className="px-5 py-3 text-left">{t("recent.client")}</th>
                <th className="px-5 py-3 text-left">{t("recent.agent")}</th>
                <th className="px-5 py-3 text-right">{tTable("amount")}</th>
                <th className="px-5 py-3 text-left">{tTable("status")}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => {
                const type = CLAIM_TYPE[c.type];
                const TypeIcon = type.icon;
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-mono text-xs text-primary">{c.id}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="flex size-7 items-center justify-center rounded-md"
                          style={{ backgroundColor: type.bg, color: type.color }}
                        >
                          <TypeIcon className="size-4" />
                        </span>
                        {tType(c.type)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground">{c.client}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {c.agent ?? t("recent.unassigned")}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{money(c.amount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
