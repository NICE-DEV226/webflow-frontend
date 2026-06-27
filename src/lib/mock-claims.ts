import type { ClaimStatus } from "./claim-status";
import type { ClaimType } from "./claim-type";

export interface MockClaim {
  id: string;
  type: ClaimType;
  /** ISO date (incident / submission). */
  date: string;
  amount: number;
  currency: string;
  status: ClaimStatus;
}

/**
 * Données de démonstration tant que l'API XCore n'est pas branchée.
 * Volontairement variées (types + statuts) pour montrer le design system.
 */
export const MOCK_CLAIMS: MockClaim[] = [
  { id: "CLM-2026-0042", type: "health", date: "2026-06-05", amount: 1200, currency: "USD", status: "paid" },
  { id: "CLM-2026-0043", type: "vehicle", date: "2026-06-07", amount: 4500, currency: "USD", status: "evaluation" },
  { id: "CLM-2026-0044", type: "property", date: "2026-06-10", amount: 800, currency: "USD", status: "submitted" },
  { id: "CLM-2026-0045", type: "liability", date: "2026-06-12", amount: 9000, currency: "USD", status: "under_review" },
  { id: "CLM-2026-0046", type: "health", date: "2026-06-14", amount: 350, currency: "USD", status: "approved" },
  { id: "CLM-2026-0047", type: "other", date: "2026-06-15", amount: 600, currency: "USD", status: "rejected" },
];

const IN_PROGRESS: ClaimStatus[] = ["submitted", "under_review", "evaluation", "approved"];

export interface ClaimDocument {
  name: string;
  size: string;
  kind: "photo" | "pdf";
}

export interface ClaimDetail extends MockClaim {
  policyNumber: string;
  amountApproved?: number;
  documents: ClaimDocument[];
}

/** Détail enrichi d'un sinistre (mock). Tombe sur un dossier par défaut si l'id est inconnu. */
export function getClaimDetail(id: string): ClaimDetail {
  const base = MOCK_CLAIMS.find((c) => c.id === id) ?? MOCK_CLAIMS[1];
  return {
    ...base,
    id,
    policyNumber: "AUTO-2024-78341",
    documents: [
      { name: "photo-front.jpg", size: "2.1 MB", kind: "photo" },
      { name: "photo-side.jpg", size: "1.8 MB", kind: "photo" },
      { name: "police-report.pdf", size: "412 KB", kind: "pdf" },
    ],
  };
}

export interface AgentQueueItem {
  id: string;
  type: ClaimType;
  amount: number;
  currency: string;
  claimant: string;
  receivedAgo: string;
  urgent: boolean;
}

/** File d'attente d'un agent évaluateur (mock). */
export const AGENT_QUEUE: AgentQueueItem[] = [
  { id: "CLM-2026-0041", type: "health", amount: 8000, currency: "USD", claimant: "Awa Kaboré", receivedAgo: "4h", urgent: true },
  { id: "CLM-2026-0043", type: "vehicle", amount: 4500, currency: "USD", claimant: "Thomas Traoré", receivedAgo: "2h", urgent: false },
  { id: "CLM-2026-0045", type: "liability", amount: 9000, currency: "USD", claimant: "Paul Ouédraogo", receivedAgo: "1h", urgent: true },
];

// ── Données dashboard admin (mock) ──
export const ADMIN_STATUS_DIST: { status: ClaimStatus; value: number }[] = [
  { status: "approved", value: 47 },
  { status: "evaluation", value: 23 },
  { status: "rejected", value: 18 },
  { status: "closed", value: 12 },
];

/** Volume de sinistres par jour (14 derniers jours). */
export const ADMIN_VOLUME: number[] = [
  8, 12, 6, 14, 9, 11, 17, 10, 13, 7, 15, 12, 18, 14,
];

export interface AdminRecentClaim {
  id: string;
  type: ClaimType;
  client: string;
  agent: string | null;
  amount: number;
  currency: string;
  status: ClaimStatus;
}

export const ADMIN_RECENT: AdminRecentClaim[] = [
  { id: "CLM-2026-0047", type: "other", client: "Léa Martin", agent: "Thomas Koné", amount: 600, currency: "USD", status: "rejected" },
  { id: "CLM-2026-0046", type: "health", client: "Yann Sawadogo", agent: null, amount: 350, currency: "USD", status: "approved" },
  { id: "CLM-2026-0045", type: "liability", client: "Paul Ouédraogo", agent: "Thomas Koné", amount: 9000, currency: "USD", status: "under_review" },
  { id: "CLM-2026-0044", type: "property", client: "Inès Diallo", agent: null, amount: 800, currency: "USD", status: "submitted" },
  { id: "CLM-2026-0043", type: "vehicle", client: "Thomas Traoré", agent: "Awa Bance", amount: 4500, currency: "USD", status: "evaluation" },
  { id: "CLM-2026-0042", type: "health", client: "Marie Dupont", agent: null, amount: 1200, currency: "USD", status: "paid" },
];

export interface AdminAgent {
  name: string;
  email: string;
  active: boolean;
  handled: number;
}

export const ADMIN_AGENTS: AdminAgent[] = [
  { name: "Thomas Koné", email: "thomas@assureur-demo.com", active: true, handled: 47 },
  { name: "Awa Bance", email: "awa@assureur-demo.com", active: true, handled: 38 },
  { name: "Jean Somé", email: "jean@assureur-demo.com", active: false, handled: 12 },
];

export interface AuditEvent {
  actor: string;
  action: string;
  target: string;
  when: string;
}

/** Piste d'audit immuable (mock) — l'argument conformité. */
export const ADMIN_AUDIT: AuditEvent[] = [
  { actor: "Marie Dupont", action: "claim.submitted", target: "CLM-2026-0043", when: "07 Jun · 14:32" },
  { actor: "System", action: "claim.assigned", target: "CLM-2026-0043", when: "07 Jun · 14:33" },
  { actor: "Thomas Koné", action: "evaluation.done", target: "CLM-2026-0043", when: "07 Jun · 16:40" },
  { actor: "System", action: "claim.approved", target: "CLM-2026-0043", when: "07 Jun · 16:41" },
  { actor: "System", action: "payment.created", target: "CLM-2026-0043", when: "07 Jun · 16:46" },
  { actor: "System", action: "payment.succeeded", target: "CLM-2026-0042", when: "06 Jun · 11:20" },
  { actor: "Awa Bance", action: "evaluation.done", target: "CLM-2026-0047", when: "05 Jun · 09:14" },
  { actor: "David Laurent", action: "agent.invited", target: "jean@assureur-demo.com", when: "04 Jun · 17:02" },
];

export function claimantKpis(claims: MockClaim[]) {
  return {
    total: claims.length,
    inProgress: claims.filter((c) => IN_PROGRESS.includes(c.status)).length,
    reimbursed: claims.filter((c) => c.status === "paid").length,
    received: claims
      .filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + c.amount, 0),
  };
}
