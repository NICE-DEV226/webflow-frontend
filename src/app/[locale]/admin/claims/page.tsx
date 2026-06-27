import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/claim/status-badge";
import { CLAIM_TYPE } from "@/lib/claim-type";
import { ADMIN_RECENT } from "@/lib/mock-claims";

const ADMIN = { name: "David Laurent", email: "david@assureur-demo.com" };

export default async function AdminClaimsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("adminPages.claims");
  const tTable = await getTranslations("dashboard.claimant.table");
  const tType = await getTranslations("claimForm.fields.claim_type.options");
  const tRecent = await getTranslations("admin.recent");

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <AppShell role="admin" user={ADMIN} title={t("title")} unread={3}>
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
              {ADMIN_RECENT.map((c, i) => {
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
