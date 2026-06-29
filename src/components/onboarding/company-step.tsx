"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Loader2, Palette, Upload } from "lucide-react";

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
import { getRefreshToken, ApiError } from "@/lib/api/client";
import { setupCreate, updateTenantSettings } from "@/lib/api/tenants";
import { toast } from "sonner";

const COUNTRIES = [
  { value: "CI", labelKey: "company.countries.CI" },
  { value: "SN", labelKey: "company.countries.SN" },
  { value: "BF", labelKey: "company.countries.BF" },
  { value: "ML", labelKey: "company.countries.ML" },
  { value: "CM", labelKey: "company.countries.CM" },
  { value: "US", labelKey: "company.countries.US" },
  { value: "FR", labelKey: "company.countries.FR" },
  { value: "UK", labelKey: "company.countries.UK" },
];

const SECTORS = [
  { value: "auto", labelKey: "company.sectors.auto" },
  { value: "health", labelKey: "company.sectors.health" },
  { value: "property", labelKey: "company.sectors.property" },
  { value: "liability", labelKey: "company.sectors.liability" },
  { value: "life", labelKey: "company.sectors.life" },
  { value: "transport", labelKey: "company.sectors.transport" },
  { value: "multi", labelKey: "company.sectors.multi" },
  { value: "other", labelKey: "company.sectors.other" },
];

export interface CompanyFormData {
  name: string;
  email: string;
  country: string;
  countryLabel: string;
  sector: string;
  sectorLabel: string;
  agentCount: string;
  primaryColor: string;
  secondaryColor: string;
  logoPreview: string | null;
}

export function CompanyStep({ onNext }: { onNext: (data: { tenantId: string; company: CompanyFormData }) => void }) {
  const t = useTranslations("onboarding");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [sector, setSector] = useState("");
  const [agentCount, setAgentCount] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1E3A5F");
  const [secondaryColor, setSecondaryColor] = useState("#1D9E75");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

  async function handleNext() {
    if (!validate()) return;
    setLoading(true);
    try {
      const refresh_token = getRefreshToken();
      if (!refresh_token) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }
      const setupRes = await setupCreate({
        refresh_token,
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      });
      await updateTenantSettings(setupRes.tenant_id!, {
        primaryColor,
        secondaryColor,
        logoUrl: logoPreview,
      });
      const countryLabel = t(COUNTRIES.find((c) => c.value === country)?.labelKey ?? "") || country;
      const sectorLabel = t(SECTORS.find((s) => s.value === sector)?.labelKey ?? "") || sector;
      onNext({
        tenantId: setupRes.tenant_id!,
        company: {
          name: name.trim(),
          email,
          country,
          countryLabel,
          sector,
          sectorLabel,
          agentCount,
          primaryColor,
          secondaryColor,
          logoPreview,
        },
      });
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(e.message);
      } else {
        toast.error(t("errors.generic") || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
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
                    {t(c.labelKey)}
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
                    {t(s.labelKey)}
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
        <Button size="lg" onClick={handleNext} disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
