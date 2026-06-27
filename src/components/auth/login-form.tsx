"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();

  const onSubmit = async () => {
    // Démo : pas de backend — simulation puis redirection vers le portail.
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard/claims");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...register("email", {
            required: t("errors.required"),
            pattern: { value: EMAIL_RE, message: t("errors.email") },
          })}
        />
        {errors.email && (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <Link
            href="/login"
            className="text-xs font-medium text-emerald hover:underline"
          >
            {t("login.forgot")}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: t("errors.required"),
            minLength: { value: 6, message: t("errors.min", { n: 6 }) },
          })}
        />
        {errors.password && (
          <p className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("login.submit")}
      </Button>
    </form>
  );
}
