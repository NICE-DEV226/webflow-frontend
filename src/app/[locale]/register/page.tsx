import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentTenant } from "@/lib/tenant-server";

export default async function RegisterPage({
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
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      tenant={tenant}
      footer={
        <>
          {t("register.haveAccount")}{" "}
          <Link href="/login" className="font-medium text-emerald hover:underline">
            {t("register.signIn")}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
