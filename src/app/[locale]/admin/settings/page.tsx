import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { SettingsForm } from "@/components/admin/settings-form";

const ADMIN = { name: "David Laurent", email: "david@assureur-demo.com" };

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("adminPages.settings");

  return (
    <AppShell role="admin" user={ADMIN} title={t("title")} unread={3}>
      <SettingsForm />
    </AppShell>
  );
}
