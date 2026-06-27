import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/claim/status-badge";
import { CLAIM_TYPE } from "@/lib/claim-type";
import { ADMIN_RECENT } from "@/lib/mock-claims";

const AGENT = { name: "Thomas Koné", email: "thomas@example.com" };
const DECIDED = ["approved", "rejected", "paid"] as const;

export default async function AgentEvaluationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav.agent");
  const tTable = await getTranslations("dashboard.claimant.table");
  const tType = await getTranslations("claimForm.fields.claim_type.options");
  const tRecent = await getTranslations("admin.recent");

  const rows = ADMIN_RECENT.filter((c) =>
    (DECIDED as readonly string[]).includes(c.status),
  );

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <AppShell role="agent" user={AGENT} title={tNav("evaluations")}>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 text-left">{tTable("id")}</th>
                <th className="px-5 py-3 text-left">{tTable("type")}</th>
                <th className="px-5 py-3 text-left">{tRecent("client")}</th>
                <th className="px-5 py-3 text-right">{tTable("amount")}</th>
                <th className="px-5 py-3 text-left">{tTable("status")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
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
