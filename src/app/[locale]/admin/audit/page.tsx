import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ADMIN_AUDIT } from "@/lib/mock-claims";

const ADMIN = { name: "David Laurent", email: "david@assureur-demo.com" };

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("adminPages.audit");

  return (
    <AppShell role="admin" user={ADMIN} title={t("title")} unread={3}>
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-l-4 border-l-emerald bg-card p-4 shadow-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald" />
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 text-left">{t("actor")}</th>
                <th className="px-5 py-3 text-left">{t("action")}</th>
                <th className="px-5 py-3 text-left">{t("target")}</th>
                <th className="px-5 py-3 text-right">{t("when")}</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_AUDIT.map((e, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3 text-foreground">{e.actor}</td>
                  <td className="px-5 py-3">
                    <span className="rounded bg-accent px-2 py-0.5 font-mono text-xs text-primary">
                      {e.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {e.target}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {e.when}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
