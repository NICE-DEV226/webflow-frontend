import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentTenant } from "@/lib/tenant-server";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
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
    </AuthLayout>
  );
}
