"use client";

import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layout/app-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { useAuth } from "@/components/auth-provider";

export default function AdminSettingsPage() {
  const t = useTranslations("adminPages.settings");
  const { user } = useAuth();

  const sidebarUser = user
    ? { name: user.email, email: user.email }
    : { name: "", email: "" };

  return (
    <AppShell role="admin" user={sidebarUser} title={t("title")} unread={3}>
      <SettingsForm />
    </AppShell>
  );
}
