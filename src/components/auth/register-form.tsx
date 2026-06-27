"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface RegisterValues {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  password: string;
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    router.push("/onboarding");
  };

  const errorText = (msg?: string) =>
    msg ? <p className="text-xs font-medium text-destructive">{msg}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">{t("register.firstName")}</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register("firstName", { required: t("errors.required") })}
          />
          {errorText(errors.firstName?.message)}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">{t("register.lastName")}</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register("lastName", { required: t("errors.required") })}
          />
          {errorText(errors.lastName?.message)}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">{t("register.company")}</Label>
        <Input
          id="company"
          autoComplete="organization"
          aria-invalid={!!errors.company}
          {...register("company", { required: t("errors.required") })}
        />
        {errorText(errors.company?.message)}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("register.workEmail")}</Label>
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
        {errorText(errors.email?.message)}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: t("errors.required"),
            minLength: { value: 6, message: t("errors.min", { n: 6 }) },
          })}
        />
        {errorText(errors.password?.message)}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("register.submit")}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {t("register.terms")}
      </p>
    </form>
  );
}
