import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, CreditCard } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { Lottie } from "@/components/lottie/lottie";
import { getClaimDetail } from "@/lib/api/claims";
import { getMe } from "@/lib/api/auth";
import { getServerToken } from "@/lib/api/with-server-auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("payment");
  const token = await getServerToken();
  if (!token) redirect(`/${locale}/login`);
  const user = await getMe(token);
  const claim = await getClaimDetail(id, token);
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(claim.amount_claimed);

  const rows = [
    { label: t("amount"), value: money, mono: true },
    { label: t("claim"), value: claim.id, mono: true },
    { label: t("reference"), value: "pi_3Qk7Zx2eZvKYlo2C", mono: true },
    { label: t("method"), value: "Visa •••• 4242", mono: false },
  ];

  return (
    <AppShell role="claimant" user={{ name: user.email, email: user.email }} title={t("title")}>
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <Lottie
            src="/animations/approved.lottie"
            className="mx-auto size-40"
            respectReducedMotion={false}
            aria-label={t("title")}
            fallback={
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald text-white">
                <Check className="size-10" strokeWidth={3} />
              </div>
            }
          />

          <h1 className="mt-2 text-2xl font-bold text-primary">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("subtitle", { amount: money })}
          </p>

          <dl className="mt-6 space-y-3 rounded-xl border bg-background p-4 text-left text-sm">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className={cn("text-foreground", r.mono && "font-mono text-xs")}>
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={`/dashboard/claims/${claim.id}`}
              className={buttonVariants({ size: "lg" })}
            >
              {t("viewClaim")}
            </Link>
            <Link
              href="/dashboard/claims"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              {t("backToClaims")}
            </Link>
          </div>

          <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CreditCard className="size-3.5" />
            {t("securedBy")}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
