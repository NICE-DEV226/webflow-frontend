"use client";

import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { ClaimLifecycleFlow } from "@/components/claim/claim-lifecycle-flow";
import { useAuth } from "@/components/auth-provider";

export default function AdminWorkflowPage() {
  const t = useTranslations("adminPages.workflow");
  const { user } = useAuth();

  const sidebarUser = user
    ? { name: `${user.firstName} ${user.lastName}`, email: user.email }
    : { name: "", email: "" };

  return (
    <AppShell role="admin" user={sidebarUser} title={t("title")} unread={3}>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        {t("subtitle")}
      </p>
      <ClaimLifecycleFlow currentStatus="evaluation" />
    </AppShell>
  );
}
