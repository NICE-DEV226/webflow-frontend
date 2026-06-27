import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, FileText, Image as ImageIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { AgentEvaluationForm } from "@/components/agent/agent-evaluation-form";
import { CLAIM_TYPE } from "@/lib/claim-type";
import { getClaimDetail, getAgentQueue } from "@/lib/api/claims";
import { getMe } from "@/lib/api/auth";

export default async function AgentClaimPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("claimDetail");
  const tAgent = await getTranslations("agent");
  const tType = await getTranslations("claimForm.fields.claim_type.options");

  const user = await getMe();
  const claim = await getClaimDetail(id);
  const queue = await getAgentQueue();
  const claimant = queue.find((c) => c.id === id)?.claimant ?? claim.clientName ?? "—";
  const type = CLAIM_TYPE[claim.type];
  const TypeIcon = type.icon;

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: claim.currency,
      maximumFractionDigits: 0,
    }).format(n);
  const fmtDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(claim.date));

  return (
    <AppShell role="agent" user={{ name: user.firstName + " " + user.lastName, email: user.email }} title={claim.id} unread={queue.length}>
      <Link
        href="/agent/queue"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {tAgent("queue.title")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left — claim details (read-only) */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 items-center justify-center rounded-lg"
                style={{ backgroundColor: type.bg, color: type.color }}
              >
                <TypeIcon className="size-5" />
              </span>
              <div>
                <p className="font-mono text-xs text-muted-foreground">{claim.id}</p>
                <p className="font-semibold text-foreground">{tType(claim.type)}</p>
                <p className="text-xs text-muted-foreground">
                  {tAgent("queue.claimant")}: {claimant}
                </p>
              </div>
              <span className="ml-auto font-mono text-lg font-bold text-primary tabular-nums">
                {money(claim.amount)}
              </span>
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

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {t("documentsTitle")} ({claim.documents.length})
            </h2>
            <div className="grid grid-cols-3 gap-3">
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
            </div>
          </div>
        </div>

        {/* Right — evaluation form */}
        <AgentEvaluationForm claimedAmount={claim.amount} currency={claim.currency} />
      </div>
    </AppShell>
  );
}
