import { api } from "./client";

export type ClaimType = "health" | "vehicle" | "property" | "liability" | "other";

export interface ClaimListItem {
  id: string;
  type: string;
  status: string;
  title: string;
  amount_claimed: number;
  amount_approved?: number | null;
  incident_date: string;
  submitted_at?: string | null;
  decided_at?: string | null;
  agent_id?: string | null;
  created_at: string;
}

export interface ClaimCreate {
  type: ClaimType;
  title: string;
  description: string;
  amount_claimed: number;
  incident_date: string;
  meta_insurer_number?: string | null;
  meta_police_report?: string | null;
  meta_vehicle_plate?: string | null;
  meta_property_address?: string | null;
}

export interface ClaimAdminStats {
  total: number;
  by_status: Record<string, number>;
  avg_processing_days?: number | null;
  total_approved_amount: number;
  total_claimed_amount: number;
  auto_approved: number;
  manual_approved: number;
}

export interface ClaimListResponse {
  items: ClaimListItem[];
  total: number;
  page: number;
  page_size: number;
}

export async function getMyClaims(serverToken?: string | null): Promise<ClaimListItem[]> {
  const res = await api.get<ClaimListResponse>("/xclaims/claimant/claims", serverToken);
  return res.items;
}

export async function createClaim(data: ClaimCreate): Promise<ClaimListItem> {
  return api.post<ClaimListItem>("/xclaims/claimant/claims", data);
}

export async function getClaimDetail(id: string, serverToken?: string | null): Promise<ClaimListItem> {
  return api.get<ClaimListItem>(`/xclaims/claimant/claims/${id}`, serverToken);
}

export async function submitClaim(id: string): Promise<void> {
  return api.post(`/xclaims/claimant/claims/${id}/submit`);
}

export async function getAgentQueue(serverToken?: string | null): Promise<ClaimListItem[]> {
  return api.get<ClaimListItem[]>("/xclaims/agent/queue", serverToken);
}

export async function getAllAgentClaims(): Promise<ClaimListItem[]> {
  return api.get<ClaimListItem[]>("/xclaims/agent/all");
}

export async function getAgentClaimDetail(id: string): Promise<ClaimListItem> {
  return api.get<ClaimListItem>(`/xclaims/agent/claims/${id}`);
}

export async function evaluateClaim(id: string, data: Record<string, unknown>): Promise<void> {
  return api.post(`/xclaims/agent/claims/${id}/evaluate`, data);
}

export async function assignClaimToMe(id: string): Promise<void> {
  return api.post(`/xclaims/agent/claims/${id}/assign`);
}

export async function getAdminClaims(): Promise<ClaimListItem[]> {
  return api.get<ClaimListItem[]>("/xclaims/admin/claims");
}

export async function getAdminClaimDetail(id: string): Promise<ClaimListItem> {
  return api.get<ClaimListItem>(`/xclaims/admin/claims/${id}`);
}

export async function assignClaim(claimId: string, agentId: string): Promise<void> {
  return api.post(`/xclaims/admin/claims/${claimId}/assign/${agentId}`);
}

export async function closeClaim(id: string): Promise<void> {
  return api.post(`/xclaims/admin/claims/${id}/close`);
}

export async function getAdminStats(): Promise<ClaimAdminStats> {
  return api.get<ClaimAdminStats>("/xclaims/admin/stats");
}
