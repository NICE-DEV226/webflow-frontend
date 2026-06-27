import { getTranslations, setRequestLocale } from "next-intl/server";
import { BellOff } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/empty-state";

const AGENT = { name: "Thomas Koné", email: "thomas@example.com" };

export default async function AgentNotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("notifications");
  const tNav = await getTranslations("nav.agent");

  return (
    <AppShell role="agent" user={AGENT} title={tNav("notifications")}>
      <div className="rounded-xl border bg-card shadow-sm">
        <EmptyState
          title={t("empty.title")}
          body={t("empty.body")}
          animation="/animations/empty-state.lottie"
          fallback={
            <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent text-primary">
              <BellOff className="size-7" />
            </span>
          }
        />
      </div>
    </AppShell>
  );
}
