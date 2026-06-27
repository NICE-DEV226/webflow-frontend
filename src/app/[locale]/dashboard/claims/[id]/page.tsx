import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, FileText, Image as ImageIcon, Plus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ClaimLiveTracker } from "@/components/claim/claim-live-tracker";
import { getClaimDetail } from "@/lib/api/claims";
import { getMe } from "@/lib/api/auth";

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("claimDetail");
  const tNav = await getTranslations("nav.claimant");
  const user = await getMe();
  const claim = await getClaimDetail(id);

  const fmtDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(claim.date));

  return (
    <AppShell role="claimant" user={{ name: `${user.firstName} ${user.lastName}`, email: user.email }} title={claim.id} unread={2}>
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
          type={claim.type}
          amount={claim.amount}
          currency={claim.currency}
          dateISO={claim.date}
        />

        {/* Right — documents + info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {t("documentsTitle")} ({claim.documents.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {claim.documents.map((doc) => {
                const Icon = doc.kind === "pdf" ? FileText : ImageIcon;
                return (
                  <div
                    key={doc.name}
                    className="rounded-lg border bg-background p-3 transition-colors hover:border-ring"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md bg-accent text-primary">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-2 truncate text-xs font-medium text-foreground">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                );
              })}
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input p-3 text-xs text-muted-foreground transition-colors hover:border-ring hover:bg-accent"
              >
                <Plus className="size-5" />
                {t("addDocument")}
              </button>
            </div>
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
                  {claim.policyNumber}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("info.description")}</dt>
                <dd className="mt-1 text-foreground">{t("sampleDescription")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
