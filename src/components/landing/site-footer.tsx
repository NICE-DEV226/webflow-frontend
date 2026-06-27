import { useTranslations } from "next-intl";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteFooter() {
  const t = useTranslations("landing.footer");
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t("product"),
      links: [
        { label: t("features"), href: "#features" },
        { label: t("pricing"), href: "#pricing" },
        { label: t("demo"), href: "/preview" },
      ],
    },
    {
      heading: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("contact"), href: "mailto:contact@infinity-wab.com" },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
        { label: t("security"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("tagline")}
          </p>
          <LocaleSwitcher className="mt-2" />
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              {col.heading}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} ClaimFlow · Infinity WAB. {t("rights")}</p>
          <p>Built on XCore</p>
        </div>
      </div>
    </footer>
  );
}
