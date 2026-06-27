import { getTranslations, setRequestLocale } from "next-intl/server";
import { FileText, LayoutDashboard, Inbox } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentTenant } from "@/lib/tenant-server";
import { cn } from "@/lib/utils";

const DEMO_ROLES = [
  { key: "claimant", href: "/dashboard/claims", icon: FileText },
  { key: "agent", href: "/agent/queue", icon: Inbox },
  { key: "admin", href: "/admin/dashboard", icon: LayoutDashboard },
] as const;

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const tRoles = await getTranslations("roles");
  const tenant = await getCurrentTenant();

  return (
    <AuthLayout
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      tenant={tenant}
      footer={
        <>
          {t("login.noAccount")}{" "}
          <Link href="/register" className="font-medium text-emerald hover:underline">
            {t("login.signUp")}
          </Link>
        </>
      }
    >
      <LoginForm />

      {/* Demo quick-access — no real auth, jump straight into any role */}
      <div className="mt-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("demoTitle")}
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 grid gap-2">
          {DEMO_ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.key}
                href={r.href}
                className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
              >
                <Icon className="text-muted-foreground" />
                {tRoles(r.key)}
              </Link>
            );
          })}
        </div>
      </div>
    </AuthLayout>
  );
}
