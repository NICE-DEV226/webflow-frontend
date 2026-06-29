"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { getForms, type FormResponse } from "@/lib/api/public-links";
import { cn } from "@/lib/utils";

export function PublicLinksTab() {
  const t = useTranslations("adminPages.settings");
  const [forms, setForms] = useState<FormResponse[]>([]);

  useEffect(() => {
    getForms().then(setForms).catch(() => {});
  }, []);

  function copyUrl(slug: string) {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(t("publicLinks.copied"));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("publicLinks.description")}
          </p>
        </div>
      </div>

      {forms.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border py-12 text-center">
          <Link2 className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t("publicLinks.empty")}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-primary">{form.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                /f/{form.id}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => copyUrl(form.id ?? form.title ?? "")}
                title={t("publicLinks.copy")}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
