import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getTenantFromHost } from "@/lib/tenant";
import { TenantProvider } from "@/components/tenant-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ClaimFlow — From claim to payout",
  description:
    "Claims management platform for insurers: submission, automatic validation, real-time tracking and payout, in one traceable pipeline.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Résolution multi-tenant depuis le sous-domaine (allianz.claimflow.com → "allianz").
  const tenant = await getTenantFromHost((await headers()).get("host"));

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning : next-themes (classe sur <html>) + extensions navigateur. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider>
            <TenantProvider tenant={tenant}>
              <AuthProvider>
                {children}
                <Toaster position="bottom-right" />
              </AuthProvider>
            </TenantProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
