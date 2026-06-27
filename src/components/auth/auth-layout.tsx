import { useTranslations } from "next-intl";
import { ArrowLeft, Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Tenant } from "@/lib/tenant";

export function AuthLayout({
  title,
  subtitle,
  tenant,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  tenant?: Tenant;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const points = [t("point1"), t("point2"), t("point3")];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        {/* Signature canvas — dotted grid on navy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(29,158,117,0.22) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 30% 20%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 30% 20%, black, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-sidebar-primary/15 blur-3xl"
        />

        <Link href="/" className="relative z-10">
          <Logo variant="negative" />
        </Link>
        <div className="relative z-10">
          <p className="max-w-sm text-4xl font-bold tracking-tight text-white">
            {t("brandPitch")}
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sidebar-foreground">
                <span className="flex size-6 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary">
                  <Check className="size-4" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 font-mono text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} ClaimFlow · Infinity WAB
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("backHome")}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            {tenant && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5">
                <span
                  className="flex size-5 items-center justify-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: tenant.color }}
                >
                  {tenant.name.charAt(0)}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {tenant.name}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
