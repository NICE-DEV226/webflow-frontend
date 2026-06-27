import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/brand/logo";
import { XFormRenderer } from "@/components/xform/xform-renderer";
import { buildClaimForm } from "@/lib/xform/mock-claim-form";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("claimForm");
  const form = buildClaimForm(t);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <LocaleSwitcher />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          <CardDescription>{t("preview.caption")}</CardDescription>
        </CardHeader>
        <CardContent>
          <XFormRenderer form={form} />
        </CardContent>
      </Card>
    </main>
  );
}
