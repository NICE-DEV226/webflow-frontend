import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { NotificationList } from "@/components/notifications/notification-list";

const AGENT = { name: "Thomas Koné", email: "thomas@example.com" };

export default async function AgentNotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav.agent");

  return (
    <AppShell role="agent" user={AGENT} title={tNav("notifications")}>
      <NotificationList />
    </AppShell>
  );
}
