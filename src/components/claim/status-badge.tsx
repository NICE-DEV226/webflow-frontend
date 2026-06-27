import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { getClaimStatusMeta, type ClaimStatus } from "@/lib/claim-status";

interface StatusBadgeProps {
  status: ClaimStatus;
  /** Masque l'icône (utile dans les cellules de tableau denses). */
  hideIcon?: boolean;
  className?: string;
}

/**
 * Badge de statut de sinistre — couleurs sémantiques du design system (claim-status.ts),
 * libellé via i18n (namespace `claimStatus`). Isomorphe : fonctionne en Server et Client.
 */
export function StatusBadge({ status, hideIcon, className }: StatusBadgeProps) {
  const t = useTranslations("claimStatus");
  const { bg, fg, border, icon: Icon } = getClaimStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap",
        className,
      )}
      style={{ backgroundColor: bg, color: fg, borderColor: border }}
    >
      {!hideIcon && <Icon className="size-3" aria-hidden />}
      {t(status)}
    </span>
  );
}
