import { setRequestLocale } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Card, CardContent } from "@/components/ui/card";
import { NewClaimForm } from "@/components/claim/new-claim-form";

/**
 * Formulaire public d'un assureur — sans compte.
 *   ex : allianz.claimflow.com/f/auto-sinistre
 * Brandé par tenant (sous-domaine) + form chargé via xform.public (SDK).
 */
export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-2xl items-center justify-end px-6 py-4">
        <LocaleSwitcher />
      </div>
      <div className="mx-auto max-w-2xl px-6 pb-16">
        <Card>
          <CardContent className="pt-6">
            <NewClaimForm slug={slug} redirectTo={null} />
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-primary">ClaimFlow</span>
        </p>
      </div>
    </main>
  );
}
