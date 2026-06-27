import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { NewClaimForm } from "@/components/claim/new-claim-form";

const USER = { name: "Marie Dupont", email: "marie@example.com" };

export default async function NewClaimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav.claimant");
  const tDetail = await getTranslations("claimDetail");

  return (
    <AppShell role="claimant" user={USER} title={tNav("newClaim")}>
      <Link
        href="/dashboard/claims"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {tDetail("back")}
      </Link>

      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <NewClaimForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
