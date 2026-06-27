"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Palette, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveOnboardingCompany, saveOnboardingBranding, getOnboardingData } from "@/lib/mock-tenants";

const COUNTRIES = [
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "SN", label: "Sénégal" },
  { value: "BF", label: "Burkina Faso" },
  { value: "ML", label: "Mali" },
  { value: "CM", label: "Cameroun" },
  { value: "US", label: "United States" },
  { value: "FR", label: "France" },
  { value: "UK", label: "United Kingdom" },
];

const SECTORS = [
  { value: "auto", label: "Automobile" },
  { value: "health", label: "Santé" },
  { value: "property", label: "Habitation / IARD" },
  { value: "liability", label: "Responsabilité civile" },
  { value: "life", label: "Vie / Prévoyance" },
  { value: "transport", label: "Transport / Maritime" },
  { value: "multi", label: "Multi-branche" },
  { value: "other", label: "Autre" },
];

export function CompanyStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding");
  const existing = getOnboardingData()?.company;

  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
  const [sector, setSector] = useState(existing?.sector ?? "");
  const [agentCount, setAgentCount] = useState(String(existing?.agentCount ?? ""));
  const [primaryColor, setPrimaryColor] = useState("#1E3A5F");
  const [secondaryColor, setSecondaryColor] = useState("#1D9E75");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("errors.required");
    if (!email.trim()) e.email = t("errors.required");
    if (!country) e.country = t("errors.required");
    if (!sector) e.sector = t("errors.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleNext() {
    if (!validate()) return;
    saveOnboardingCompany({
      name: name.trim(),
      email: email.trim(),
      country,
      sector,
      agentCount: Number(agentCount) || 1,
    });
    saveOnboardingBranding({
      primaryColor,
      secondaryColor,
      logoUrl: logoPreview,
    });
    onNext();
  }

  return (
    <div className="space-y-8">
      {/* Company info */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Building2 className="size-5" />
          {t("company.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("company.subtitle")}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="companyName">{t("company.name")}</Label>
            <Input
              id="companyName"
              placeholder="Ex: Allianz Africa, Mutuelle Santé+"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="companyEmail">{t("company.email")}</Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="admin@compagnie.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>{t("company.country")}</Label>
            <Select value={country} onValueChange={(v) => v && setCountry(v)}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.country}>
                <SelectValue placeholder={t("company.countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>{t("company.sector")}</Label>
            <Select value={sector} onValueChange={(v) => v && setSector(v)}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.sector}>
                <SelectValue placeholder={t("company.sectorPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && <p className="text-xs text-destructive">{errors.sector}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="agentCount">{t("company.agents")}</Label>
            <Input
              id="agentCount"
              type="number"
              min={1}
              placeholder="5"
              value={agentCount}
              onChange={(e) => setAgentCount(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Branding */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Palette className="size-5" />
          {t("branding.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("branding.subtitle")}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{t("branding.primaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-muted-foreground">{primaryColor}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("branding.secondaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-muted-foreground">{secondaryColor}</span>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t("branding.logo")}</Label>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Upload className="size-4" />
                {t("branding.uploadLogo")}
                <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
              </label>
              {logoPreview && (
                <div className="flex items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="size-10 rounded-lg border object-contain"
                  />
                  <span className="text-xs text-muted-foreground">{t("branding.preview")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end border-t pt-6">
        <Button size="lg" onClick={handleNext}>
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
