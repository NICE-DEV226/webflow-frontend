"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { useTenant } from "@/components/tenant-provider";
import { XFormClient } from "@/lib/xform/xform-sdk";
import { XFormRenderer } from "@/components/xform/xform-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormDefinition } from "@/lib/xform/types";

const DEFAULT_SLUG = "claim-intake";

/**
 * Déclaration de sinistre — VRAI XForm SDK + white-label par tenant.
 *   getForm(slug) → définition depuis l'API XForm (repli local si absent)
 *   submitWithFiles(…) → upload + soumission (déclenche XFlow)
 * Le formulaire adopte le logo + le nom + la couleur de la compagnie (tenant).
 *
 * @param slug        slug du formulaire XForm (défaut: claim-intake)
 * @param redirectTo  route post-soumission ; `null` = afficher l'écran de succès du form (mode public)
 */
export function NewClaimForm({
  slug = DEFAULT_SLUG,
  redirectTo = "/dashboard/claims/CLM-2026-0099",
}: {
  slug?: string;
  redirectTo?: string | null;
}) {
  const t = useTranslations("claimForm");
  const router = useRouter();
  const tenant = useTenant();

  const client = useMemo(
    () =>
      new XFormClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
        pluginPrefix: "/app/xform",
      }),
    [],
  );

  const [form, setForm] = useState<FormDefinition | null>(null);

  useEffect(() => {
    let active = true;
    // White-label : on applique la couleur du tenant au thème du formulaire.
    const brand = (f: FormDefinition): FormDefinition => ({
      ...f,
      theme: { ...f.theme, primary_color: tenant.color },
    });
    client.public
      .getForm(slug)
      .then((r) => active && setForm(brand(r.form)))
      .catch(() => active && setForm(null));
    return () => {
      active = false;
    };
  }, [client, t, tenant.color, slug]);

  if (!form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <div>
      {/* En-tête white-label : logo + nom de la compagnie */}
      <div className="mb-6 flex items-center gap-3 border-b pb-4">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
          style={{ backgroundColor: tenant.color }}
        >
          {tenant.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {tenant.name}
          </p>
          <h2 className="truncate text-lg font-semibold text-primary">
            {form.title}
          </h2>
        </div>
      </div>

      <XFormRenderer
        form={form}
        onSubmit={async (data, meta) => {
          try {
            await client.public.submitWithFiles(form.slug ?? slug, data, meta);
          } catch {
            // L'erreur est silencieusement ignorée pour laisser XFormRenderer gérer l'UI
          }
          // redirectTo=null (mode public) → XFormRenderer affiche son écran de succès
          if (redirectTo) router.push(redirectTo);
        }}
      />
    </div>
  );
}
