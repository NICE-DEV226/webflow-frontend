import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { ClaimLifecycleFlow } from "@/components/claim/claim-lifecycle-flow";

const ADMIN = { name: "David Laurent", email: "david@assureur-demo.com" };

export default async function AdminWorkflowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("adminPages.workflow");

  return (
    <AppShell role="admin" user={ADMIN} title={t("title")} unread={3}>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        {t("subtitle")}
      </p>
      <ClaimLifecycleFlow currentStatus="evaluation" />
    </AppShell>
  );
}
