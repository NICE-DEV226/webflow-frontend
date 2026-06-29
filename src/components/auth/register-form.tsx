"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { register as registerUser, login } from "@/lib/api/auth";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/api/client";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface RegisterValues {
  email: string;
  password: string;
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("auth");
  const router = useRouter();
  const { refresh } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>();

  const onSubmit = async (data: RegisterValues) => {
    try {
      await registerUser(data);
      await login({ email: data.email, password: data.password });
      await refresh();
      router.push("/onboarding");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message);
      } else {
        toast.error(t("errors.generic"));
      }
    }
  };

  const errorText = (msg?: string) =>
    msg ? <p className="text-xs font-medium text-destructive">{msg}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className="pr-10"
            {...register("password", {
              required: t("errors.required"),
              minLength: { value: 6, message: t("errors.min", { n: 6 }) },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
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
