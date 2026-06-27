import {
  Car,
  Home,
  Scale,
  Shapes,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export type ClaimType = "health" | "vehicle" | "property" | "liability" | "other";

export interface ClaimTypeMeta {
  icon: LucideIcon;
  /** Couleur d'accent (brand doc §5.1). */
  color: string;
  /** Fond du chip (teinte claire). */
  bg: string;
}

/**
 * Icône + couleur par type de sinistre (brand doc §5.1).
 * Les LIBELLÉS viennent de l'i18n (`claimForm.fields.claim_type.options.<type>`).
 */
export const CLAIM_TYPE: Record<ClaimType, ClaimTypeMeta> = {
  health: { icon: Stethoscope, color: "#3B82F6", bg: "#EFF6FF" },
  vehicle: { icon: Car, color: "#6366F1", bg: "#EEF2FF" },
  property: { icon: Home, color: "#10B981", bg: "#ECFDF5" },
  liability: { icon: Scale, color: "#F59E0B", bg: "#FFFBEB" },
  other: { icon: Shapes, color: "#64748B", bg: "#F1F5F9" },
};
