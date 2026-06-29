import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, FileText, Image as ImageIcon, Plus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ClaimLiveTracker } from "@/components/claim/claim-live-tracker";
import { type ClaimType } from "@/lib/claim-type";
import { getClaimDetail } from "@/lib/api/claims";
import { getMe } from "@/lib/api/auth";
import { getServerToken } from "@/lib/api/with-server-auth";
import { redirect } from "next/navigation";

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("claimDetail");
  const tNav = await getTranslations("nav.claimant");
  const token = await getServerToken();
  if (!token) redirect(`/${locale}/login`);
  const user = await getMe(token);
  const claim = await getClaimDetail(id, token);

  const fmtDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(claim.incident_date));

  return (
    <AppShell role="claimant" user={{ name: user.email, email: user.email }} title={claim.id} unread={2}>
      <Link
        href="/dashboard/claims"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left — live tracker */}
        <ClaimLiveTracker
          id={claim.id}
          type={claim.type as ClaimType}
          amount={claim.amount_claimed}
          currency="USD"
          dateISO={claim.incident_date}
        />

        {/* Right — documents + info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {t("documentsTitle")} (0)
            </h2>
            <button
              type="button"
              className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input p-3 text-xs text-muted-foreground transition-colors hover:border-ring hover:bg-accent"
            >
              <Plus className="size-5" />
              {t("addDocument")}
            </button>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {t("info.title")}
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("info.incidentDate")}</dt>
                <dd className="text-right font-medium text-foreground">{fmtDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("info.policy")}</dt>
                <dd className="text-right font-mono text-xs text-foreground">
                  {claim.id}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("info.description")}</dt>
                <dd className="mt-1 text-foreground">{claim.title}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
