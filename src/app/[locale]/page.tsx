import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Banknote, Check, Clock, ShieldCheck } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { HeroArt } from "@/components/landing/hero-art";
import { AnimatedHeadline } from "@/components/landing/animated-headline";
import { DisplayCards } from "@/components/ui/display-cards";
import { ClaimLifecycleFlow } from "@/components/claim/claim-lifecycle-flow";
import { cn } from "@/lib/utils";

const PROBLEM_CARDS = [
  { key: "faster", icon: Clock },
  { key: "traceable", icon: ShieldCheck },
  { key: "automated", icon: Banknote },
] as const;

const HOW_STEPS = ["declare", "validate", "approve", "reimburse"] as const;
const PLANS = ["starter", "growth", "enterprise"] as const;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("landing");

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Signature: the product's dotted-grid canvas, faded at the edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(ellipse 75% 55% at 50% 0%, black, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 55% at 50% 0%, black, transparent 75%)",
            }}
          />
          <div className="pointer-events-none absolute -top-32 right-0 -z-10 size-[36rem] rounded-full bg-emerald/5 blur-3xl" />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-32 pb-16 lg:grid-cols-2 lg:pt-36">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                <span className="size-1.5 rounded-full bg-emerald" />
                {t("hero.badge")}
              </span>
              <AnimatedHeadline />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className={buttonVariants({ size: "lg" })}
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight />
                </Link>
                <Link
                  href="/preview"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            <HeroArt />
          </div>

          {/* SOCIAL PROOF — ledger voice (mono figures) */}
          <div className="border-y bg-card">
            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
              {[
                { v: t("stats.claimsValue"), l: t("stats.claims") },
                { v: t("stats.satisfactionValue"), l: t("stats.satisfaction") },
                { v: t("stats.avgTimeValue"), l: t("stats.avgTime") },
              ].map((s) => (
                <div key={s.l} className="px-4 py-2 text-center">
                  <p className="font-mono text-4xl font-bold tracking-tight text-primary tabular-nums">
                    {s.v}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t("problem.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("problem.subtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROBLEM_CARDS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`problem.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`problem.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y bg-card">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">{t("how.title")}</h2>
              <p className="mt-3 text-muted-foreground">{t("how.subtitle")}</p>
            </div>
            <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Pipeline connector — the flow line through the stages */}
              <div
                aria-hidden
                className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-0.5 bg-gradient-to-r from-primary via-emerald to-emerald lg:block"
              />
              {HOW_STEPS.map((step, i) => (
                <div key={step} className="relative">
                  <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground ring-4 ring-card">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {t(`how.${step}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`how.${step}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section id="pipeline" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t("pipeline.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("pipeline.subtitle")}</p>
          </div>
          <div className="mt-10">
            <ClaimLifecycleFlow currentStatus="evaluation" className="mx-auto" />
          </div>
        </section>

        {/* LINE OF BUSINESS — branded stacked cards */}
        <section className="overflow-hidden border-y bg-card">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("lob.title")}</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                {t("lob.subtitle")}
              </p>
            </div>
            <div className="flex min-h-[18rem] items-center justify-center overflow-hidden">
              <div className="origin-center scale-[0.72] sm:scale-90 lg:scale-100">
                <DisplayCards />
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-t bg-card">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">{t("pricing.title")}</h2>
              <p className="mt-3 text-muted-foreground">{t("pricing.subtitle")}</p>
            </div>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
              {PLANS.map((plan) => {
                const featured = plan === "growth";
                const isEnterprise = plan === "enterprise";
                const features = t.raw(`pricing.${plan}.features`) as string[];
                return (
                  <div
                    key={plan}
                    className={cn(
                      "relative rounded-2xl border bg-background p-6 shadow-sm",
                      featured && "border-emerald shadow-md ring-1 ring-emerald lg:-mt-3 lg:pb-9",
                    )}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald px-3 py-1 text-xs font-semibold text-emerald-foreground">
                        {t("pricing.mostPopular")}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold">{t(`pricing.${plan}.name`)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`pricing.${plan}.tagline`)}
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-primary">
                        {t(`pricing.${plan}.price`)}
                      </span>
                      {!isEnterprise && (
                        <span className="text-sm text-muted-foreground">
                          {t("pricing.perMonth")}
                        </span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-2.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={isEnterprise ? "/register" : `/register?plan=${plan}`}
                      className={cn(
                        buttonVariants({ variant: featured ? "success" : "outline" }),
                        "mt-6 w-full",
                      )}
                    >
                      {isEnterprise ? t("pricing.ctaEnterprise") : t("pricing.cta")}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-6 py-20 lg:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            {t("faq.title")}
          </h2>
          <div className="mt-10 divide-y rounded-xl border bg-card">
            {(t.raw("faq.items") as { q: string; a: string }[]).map((item) => (
              <details key={item.q} className="group px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium text-foreground">
                  {item.q}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA BAND */}
        <section className="bg-primary">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 text-primary-foreground/80">{t("cta.subtitle")}</p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "success", size: "lg" }),
                "mt-8",
              )}
            >
              {t("cta.button")}
              <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
