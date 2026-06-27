"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/claim/status-badge";
import { CLAIM_TYPE } from "@/lib/claim-type";
import { getAdminRecentClaims, type RecentClaim } from "@/lib/api/claims";
import { useAuth } from "@/components/auth-provider";

export default function AdminClaimsPage() {
  const t = useTranslations("adminPages.claims");
  const tTable = useTranslations("dashboard.claimant.table");
  const tType = useTranslations("claimForm.fields.claim_type.options");
  const tRecent = useTranslations("admin.recent");
  const locale = useLocale();
  const { user } = useAuth();

  const [claims, setClaims] = useState<RecentClaim[]>([]);

  useEffect(() => {
    getAdminRecentClaims().then(setClaims);
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

  return (
    <AppShell role="admin" user={sidebarUser} title={t("title")} unread={3}>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-xs font-semibold tracking-wide text-primary-foreground uppercase">
                <th className="px-5 py-3 text-left">{tTable("id")}</th>
                <th className="px-5 py-3 text-left">{tTable("type")}</th>
                <th className="px-5 py-3 text-left">{tRecent("client")}</th>
                <th className="px-5 py-3 text-left">{tRecent("agent")}</th>
                <th className="px-5 py-3 text-right">{tTable("amount")}</th>
                <th className="px-5 py-3 text-left">{tTable("status")}</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c, i) => {
                const type = CLAIM_TYPE[c.type];
                const TypeIcon = type.icon;
                return (
                  <tr key={c.id} className={i % 2 ? "bg-background" : "bg-card"}>
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
                      {c.agent ?? tRecent("unassigned")}
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
