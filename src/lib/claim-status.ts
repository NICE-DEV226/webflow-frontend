import {
  Archive,
  Banknote,
  CheckCircle,
  ClipboardCheck,
  Eye,
  FileEdit,
  Send,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Machine d'états d'un sinistre ClaimFlow.
 * draft → submitted → under_review → evaluation → approved | rejected → paid → closed
 */
export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "evaluation"
  | "approved"
  | "rejected"
  | "paid"
  | "closed";

export interface ClaimStatusMeta {
  /** Fond du badge (valeur exacte du brand doc). */
  bg: string;
  /** Couleur texte + icône du badge. */
  fg: string;
  /** Bordure du badge (brand doc §7.4). */
  border: string;
  /** Icône Lucide associée au statut. */
  icon: LucideIcon;
  /** true = état terminal (plus de transition attendue côté client). */
  terminal?: boolean;
}

/**
 * Source de vérité unique pour le rendu des statuts (couleurs + icônes).
 * Les LIBELLÉS sont gérés par i18n (namespace `claimStatus` dans messages/*.json),
 * jamais en dur ici — voir StatusBadge / claim-lifecycle-flow.
 * Couleurs reprises au pixel près du document de design.
 */
export const CLAIM_STATUS: Record<ClaimStatus, ClaimStatusMeta> = {
  draft: { bg: "#F1F5F9", fg: "#64748B", border: "#CBD5E1", icon: FileEdit },
  submitted: { bg: "#EFF6FF", fg: "#3B82F6", border: "#BFDBFE", icon: Send },
  under_review: { bg: "#FFFBEB", fg: "#D97706", border: "#FCD34D", icon: Eye },
  evaluation: { bg: "#FFF7ED", fg: "#EA580C", border: "#FDBA74", icon: ClipboardCheck },
  approved: { bg: "#ECFDF5", fg: "#16A34A", border: "#86EFAC", icon: CheckCircle },
  rejected: { bg: "#FEF2F2", fg: "#DC2626", border: "#FCA5A5", icon: XCircle, terminal: true },
  paid: { bg: "#F0FDF4", fg: "#15803D", border: "#4ADE80", icon: Banknote },
  closed: { bg: "#F8FAFC", fg: "#475569", border: "#CBD5E1", icon: Archive, terminal: true },
};

/** Ordre chronologique du happy path — utile pour les timelines et barres de progression. */
export const CLAIM_FLOW_ORDER: ClaimStatus[] = [
  "submitted",
  "under_review",
  "evaluation",
  "approved",
  "paid",
  "closed",
];

export function getClaimStatusMeta(status: ClaimStatus): ClaimStatusMeta {
  return CLAIM_STATUS[status] ?? CLAIM_STATUS.draft;
}
