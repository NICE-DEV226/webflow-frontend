import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/claim/status-badge";
import { ClaimLifecycleFlow } from "@/components/claim/claim-lifecycle-flow";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { CLAIM_STATUS, type ClaimStatus } from "@/lib/claim-status";

const swatches = [
  { name: "Navy Deep", hex: "#1E3A5F", role: "Primary", fg: "#FFFFFF" },
  { name: "Emerald", hex: "#1D9E75", role: "Accent / CTA", fg: "#FFFFFF" },
  { name: "Cloud White", hex: "#F8FAFC", role: "Surface", fg: "#334155" },
  { name: "Slate 700", hex: "#334155", role: "Text", fg: "#FFFFFF" },
  { name: "Gray 500", hex: "#64748B", role: "Secondary", fg: "#FFFFFF" },
  { name: "Slate 200", hex: "#E2E8F0", role: "Borders", fg: "#334155" },
];

export default function StyleGuidePage() {
  const t = useTranslations("styleguide");
  const tc = useTranslations("common");
  const ta = useTranslations("actions");
  const tl = useTranslations("lifecycle");
  const tn = useTranslations("nav.claimant");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Logo className="[&_span]:text-2xl" markClassName="size-9" />
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {t("badge")}
          </span>
          <LocaleSwitcher className="ml-auto" />
        </div>
        <p className="mt-2 max-w-xl text-muted-foreground">{tc("tagline")}</p>
      </header>

      {/* Couleurs */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">{t("palette")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map((s) => (
            <div
              key={s.hex}
              className="flex flex-col justify-between rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: s.hex, color: s.fg }}
            >
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="mt-6 text-xs opacity-80">{s.role}</span>
              <span className="font-mono text-xs opacity-80">{s.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typographie */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">{t("typography")}</h2>
        <Card>
          <CardContent className="space-y-2 pt-6">
            <p className="text-4xl font-bold text-primary">Display 36 · Bold</p>
            <p className="text-2xl font-bold text-primary">H1 28 · Bold</p>
            <p className="text-lg font-semibold text-primary">H2 22 · SemiBold</p>
            <p className="text-base text-foreground">
              Body · Policyholders track their claim in real time, without
              refreshing the page.
            </p>
            <p className="text-sm text-muted-foreground">
              Body S · Metadata, timestamps, secondary labels.
            </p>
            <p className="font-mono text-sm text-primary">CLM-2026-00412 · ID</p>
          </CardContent>
        </Card>
      </section>

      {/* Boutons */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">{t("buttons")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">{ta("submitClaim")}</Button>
          <Button size="lg" variant="success">
            {ta("approve")}
          </Button>
          <Button size="lg" variant="warning">
            {ta("partial")}
          </Button>
          <Button size="lg" variant="danger">
            {ta("reject")}
          </Button>
          <Button size="lg" variant="outline">
            {ta("cancel")}
          </Button>
          <Button size="lg" variant="ghost">
            {ta("viewDetails")}
          </Button>
        </div>
      </section>

      {/* Cycle de vie — vue flux (style n8n) */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold">{t("lifecycleView")}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{tl("subtitle")}</p>
        <ClaimLifecycleFlow currentStatus="evaluation" />
      </section>

      {/* Badges de statut */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold">{t("statuses")}</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {t("statusesSource")} · <span className="font-mono">claim-status.ts</span>
        </p>
        <Card>
          <CardHeader>
            <CardTitle>{tl("title")}</CardTitle>
            <CardDescription>
              draft → submitted → under_review → evaluation → approved / rejected
              → paid → closed
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(Object.keys(CLAIM_STATUS) as ClaimStatus[]).map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Sidebar navy preview */}
      <section className="mb-4">
        <h2 className="mb-4 text-xl font-semibold">{t("sidebar")}</h2>
        <div className="flex overflow-hidden rounded-xl border shadow-md">
          <nav className="w-56 space-y-1 bg-sidebar p-4 text-sidebar-foreground">
            <div className="mb-4 px-2">
              <Logo variant="negative" />
            </div>
            <a className="block rounded-md bg-sidebar-primary px-3 py-2 text-sm font-medium text-sidebar-primary-foreground">
              {tn("claims")}
            </a>
            <a className="block rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              {tn("newClaim")}
            </a>
            <a className="block rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              {tn("notifications")}
            </a>
          </nav>
          <div className="flex-1 bg-background p-6">
            <p className="text-sm text-muted-foreground">{t("sidebarNote")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
