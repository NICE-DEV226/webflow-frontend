import { api } from "./client";
import type { ClaimStatus } from "@/lib/claim-status";
import type { ClaimType } from "@/lib/claim-type";

export interface Claim {
  id: string;
  type: ClaimType;
  date: string;
  amount: number;
  currency: string;
  status: ClaimStatus;
}

export interface ClaimDetail extends Claim {
  policyNumber: string;
  clientName?: string;
  agentName?: string | null;
  amountApproved?: number;
  documents: { name: string; size: string; kind: "photo" | "pdf" }[];
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

export interface StatusDistribution {
  status: ClaimStatus;
  value: number;
}

export interface VolumeDataPoint {
  date: string;
  count: number;
}

export interface RecentClaim {
  id: string;
  type: ClaimType;
  client: string;
  agent: string | null;
  amount: number;
  currency: string;
  status: ClaimStatus;
}

export async function getMyClaims(): Promise<Claim[]> {
  return api.get<Claim[]>("/claims/mine");
}

export async function getClaimDetail(id: string): Promise<ClaimDetail> {
  return api.get<ClaimDetail>(`/claims/${id}`);
}

export async function getAgentQueue(): Promise<AgentQueueItem[]> {
  return api.get<AgentQueueItem[]>("/claims/queue");
}

export async function getAdminRecentClaims(): Promise<RecentClaim[]> {
  return api.get<RecentClaim[]>("/claims/admin/recent");
}

export async function getAdminStatusDistribution(): Promise<StatusDistribution[]> {
  return api.get<StatusDistribution[]>("/claims/admin/status-distribution");
}

export async function getAdminVolume(days = 14): Promise<VolumeDataPoint[]> {
  return api.get<VolumeDataPoint[]>(`/claims/admin/volume?days=${days}`);
}

export async function submitClaim(data: {
  type: ClaimType;
  amount: number;
  currency: string;
  description: string;
  documents?: File[];
}): Promise<Claim> {
  return api.post<Claim>("/claims", data);
}
