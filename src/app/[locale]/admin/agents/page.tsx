import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { ADMIN_AGENTS } from "@/lib/mock-claims";
import { cn } from "@/lib/utils";

const ADMIN = { name: "David Laurent", email: "david@assureur-demo.com" };

export default async function AdminAgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("adminPages.agents");

  return (
    <AppShell
      role="admin"
      user={ADMIN}
      title={t("title")}
      unread={3}
      actions={
        <button
          type="button"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus />
          {t("invite")}
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 text-left">{t("name")}</th>
                <th className="px-5 py-3 text-left">{t("email")}</th>
                <th className="px-5 py-3 text-left">{t("status")}</th>
                <th className="px-5 py-3 text-right">{t("handled")}</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_AGENTS.map((a) => {
                const initials = a.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <tr key={a.email} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2.5">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {initials}
                        </span>
                        <span className="font-medium text-foreground">{a.name}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {a.email}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          a.active
                            ? "bg-emerald/10 text-emerald"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            a.active ? "bg-emerald" : "bg-muted-foreground",
                          )}
                        />
                        {a.active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-foreground">
                      {a.handled}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
