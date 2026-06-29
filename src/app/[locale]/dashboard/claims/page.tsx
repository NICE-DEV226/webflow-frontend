import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Banknote,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Plus,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/claim/status-badge";
import { CLAIM_TYPE, type ClaimType } from "@/lib/claim-type";
import { getMyClaims } from "@/lib/api/claims";
import { getMe } from "@/lib/api/auth";
import { getServerToken } from "@/lib/api/with-server-auth";
import { getPlatformMetrics } from "@/lib/api/platform";
import { getTenants } from "@/lib/api/tenants";
import { redirect } from "next/navigation";
import type { ClaimStatus } from "@/lib/claim-status";

const IN_PROGRESS: ClaimStatus[] = ["submitted", "under_review", "evaluation", "approved"];

export default async function ClaimantClaimsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard.claimant");
  const tNav = await getTranslations("nav.claimant");
  const tType = await getTranslations("claimForm.fields.claim_type.options");
  const tActions = await getTranslations("actions");

  const token = await getServerToken();
  if (!token) redirect(`/${locale}/login`);

  // Redirect admins/agents/superadmins to their correct dashboard
  const isSuper = await getPlatformMetrics(token).then(() => true).catch(() => false);
  if (isSuper) redirect(`/${locale}/super-admin/dashboard`);
  const userTenants = await getTenants(token);
  const isOwner = userTenants.some((t) => t.is_owner);
  if (isOwner) redirect(`/${locale}/admin/dashboard`);
  if (userTenants.length > 0) redirect(`/${locale}/agent/queue`);

  const claims = await getMyClaims(token);
  const user = await getMe(token);

  const kpis = {
    total: claims.length,
    inProgress: claims.filter((c) => IN_PROGRESS.includes(c.status as ClaimStatus)).length,
    reimbursed: claims.filter((c) => c.status === "paid").length,
    received: claims
      .filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + c.amount_claimed, 0),
  };
  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const kpiCards = [
    { label: t("kpi.total"), value: String(kpis.total), icon: FileText, color: "#1E3A5F" },
    { label: t("kpi.inProgress"), value: String(kpis.inProgress), icon: Clock, color: "#F59E0B" },
    { label: t("kpi.reimbursed"), value: String(kpis.reimbursed), icon: Banknote, color: "#1D9E75" },
    { label: t("kpi.received"), value: money(kpis.received), icon: DollarSign, color: "#1E3A5F" },
  ];

  return (
    <AppShell
      role="claimant"
      user={{ name: user.email, email: user.email }}
      title={tNav("claims")}
      unread={2}
      actions={
        <Link href="/dashboard/claims/new" className={buttonVariants()}>
          <Plus />
          {tActions("newClaim")}
        </Link>
      }
    >
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${k.color}14`, color: k.color }}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-3 text-2xl font-bold text-primary">{k.value}</p>
              <p className="text-sm text-muted-foreground">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Claims table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-xs font-semibold tracking-wide text-primary-foreground uppercase">
                <th className="px-4 py-3 text-left">{t("table.id")}</th>
                <th className="px-4 py-3 text-left">{t("table.type")}</th>
                <th className="px-4 py-3 text-left">{t("table.date")}</th>
                <th className="px-4 py-3 text-right">{t("table.amount")}</th>
                <th className="px-4 py-3 text-left">{t("table.status")}</th>
                <th className="px-4 py-3 text-right">{t("table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c, i) => {
                const type = CLAIM_TYPE[c.type as ClaimType];
                const TypeIcon = type.icon;
                return (
                  <tr
                    key={c.id}
                    className={i % 2 === 1 ? "bg-background" : "bg-card"}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-primary">{c.id}</td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-muted-foreground">{date(c.created_at)}</td>
                    <td className="px-4 py-3 text-right font-medium">{money(c.amount_claimed)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status as ClaimStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/claims/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-emerald hover:underline"
                      >
                        {t("view")}
                        <ChevronRight className="size-4" />
                      </Link>
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
