"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Upload, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { getTenant, updateTenant, updateTenantSettings, getTenantSettings } from "@/lib/api/tenants";

const DEFAULTS = {
  name: "",
  primaryColor: "#1E3A5F",
  secondaryColor: "#1D9E75",
};

export function BrandingTab() {
  const t = useTranslations("adminPages.settings");
  const { user, tenantId: authTenantId } = useAuth();
  const tenantId = authTenantId ?? "";

  const [name, setName] = useState(DEFAULTS.name);
  const [primaryColor, setPrimaryColor] = useState(DEFAULTS.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULTS.secondaryColor);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    Promise.all([
      getTenant(tenantId),
      getTenantSettings(tenantId),
    ]).then(([tenant, settings]) => {
      setName(tenant.name);
      setPrimaryColor((settings.primaryColor as string) ?? DEFAULTS.primaryColor);
      setSecondaryColor((settings.secondaryColor as string) ?? DEFAULTS.secondaryColor);
      setLogoPreview((settings.logoUrl as string) ?? null);
    }).catch(() => {});
  }, [tenantId]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        updateTenant(tenantId, { name }),
        updateTenantSettings(tenantId, {
          primaryColor,
          secondaryColor,
          logoUrl: logoPreview,
        }),
      ]);
      toast.success(t("branding.saved"));
    } catch {
      toast.error(t("branding.error"));
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setPrimaryColor(DEFAULTS.primaryColor);
    setSecondaryColor(DEFAULTS.secondaryColor);
    setLogoPreview(null);
  }

  return (
    <div className="space-y-8">
      {/* Company name */}
      <div className="max-w-md space-y-1.5">
        <Label htmlFor="brandName">{t("branding.companyName")}</Label>
        <Input
          id="brandName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Logo */}
      <div className="space-y-1.5">
        <Label>{t("branding.logo")}</Label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo"
              className="size-16 rounded-lg border object-contain"
            />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-lg border bg-muted text-2xl font-bold text-muted-foreground">
              {name.charAt(0)}
            </span>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Upload className="size-4" />
            {t("branding.upload")}
            <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
          </label>
        </div>
      </div>

      {/* Colors */}
      <div className="grid max-w-md gap-4 sm:grid-cols-2">
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
      </div>

      {/* Preview */}
      <div className="max-w-md rounded-xl border p-5">
        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("branding.preview")}
        </p>
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3"
          style={{ backgroundColor: `${primaryColor}14` }}
        >
          {logoPreview ? (
            <img src={logoPreview} alt="" className="size-8 rounded object-contain" />
          ) : (
            <span
              className="flex size-8 items-center justify-center rounded font-bold text-white text-xs"
              style={{ backgroundColor: primaryColor }}
            >
              {name.charAt(0)}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold" style={{ color: primaryColor }}>
              {name}
            </p>
            <p className="text-xs text-muted-foreground">{t("branding.previewSub")}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button onClick={handleSave} disabled={saving}>
          {t("branding.save")}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw className="size-4" />
          {t("branding.reset")}
        </Button>
      </div>
    </div>
  );
}
