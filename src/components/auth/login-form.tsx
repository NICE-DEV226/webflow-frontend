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
import { login } from "@/lib/api/auth";
import { getPlatformMetrics } from "@/lib/api/platform";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/api/client";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("auth");
  const router = useRouter();
  const { refresh } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();

  const onSubmit = async (data: LoginValues) => {
    try {
      const tokenRes = await login(data);
      if (tokenRes.onboarding_required) {
        router.push("/onboarding");
        return;
      }
      await refresh();
      const isSuperadmin = await getPlatformMetrics()
        .then(() => true)
        .catch(() => false);
      if (isSuperadmin) {
        router.push("/super-admin/dashboard");
        return;
      }
      const isOwner = tokenRes.tenants?.[0]?.is_owner ?? false;
      router.push(isOwner ? "/admin/dashboard" : "/agent/queue");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message);
      } else {
        toast.error(t("errors.generic"));
      }
    }
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
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
