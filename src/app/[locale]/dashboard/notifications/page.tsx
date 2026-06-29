import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { NotificationList } from "@/components/notifications/notification-list";

const USER = { name: "Marie Dupont", email: "marie@example.com" };

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav.claimant");

  return (
    <AppShell role="claimant" user={USER} title={tNav("notifications")}>
      <NotificationList />
    </AppShell>
  );
}
