import { getTranslations, setRequestLocale } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/brand/logo";
import { XFormRenderer } from "@/components/xform/xform-renderer";
import { XFormClient } from "@/lib/xform/xform-sdk";
import type { FormDefinition } from "@/lib/xform/types";

const XFORM_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("claimForm");
  const client = new XFormClient({ baseUrl: XFORM_API });

  let form: FormDefinition = {
    id: "preview",
    title: t("preview.caption"),
    owner_id: "preview",
    fields: [],
    steps: [],
    settings: {},
    theme: {},
    status: "draft",
    tags: [],
  };
  try {
    const res = await client.public.getForm("claim-intake");
    form = res.form;
  } catch {
    // keep fallback
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <LocaleSwitcher />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title ?? t("preview.caption")}</CardTitle>
          <CardDescription>{t("preview.caption")}</CardDescription>
        </CardHeader>
        <CardContent>
          <XFormRenderer form={form} />
        </CardContent>
      </Card>
    </main>
  );
}
