import { api } from "./client";

export interface GlobalStats {
  total_tasks: number;
  archived_tasks: number;
  active_tenants: number;
  by_status: Record<string, number>;
}

export interface TenantSummary {
  tenant_id: string;
  active_tasks: number;
  overdue_tasks: number;
  archived_tasks: number;
}

export interface LicensePlan {
  id: string;
  name: string;
  type: string;
  price: number;
  max_users: number;
  max_machines: number;
  features: Record<string, unknown>;
  quotas: Record<string, unknown>;
  description?: string | null;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
  billing_mode: string;
  available_modes: string[];
}

export interface ActorAudit {
  actor_id: string;
  tenant_id: string | null;
  actions: Record<string, number>;
  total_actions: number;
  soft_deleted_comments: number;
}

export async function getPlatformMetrics(serverToken?: string | null): Promise<GlobalStats> {
  return api.get<GlobalStats>("/xtasks/super-admin/stats", serverToken);
}

export async function getPlatformTenants(): Promise<TenantSummary[]> {
  return api.get<TenantSummary[]>("/xtasks/super-admin/tenants");
}

export async function getTenantDetail(tenantId: string): Promise<Record<string, unknown>> {
  return api.get<Record<string, unknown>>(`/xtasks/super-admin/tenants/${tenantId}`);
}

export async function getPlatformLicenses(): Promise<LicensePlan[]> {
  return api.get<LicensePlan[]>("/xlicense/plans");
}

export async function getPlatformAudit(actorId: string): Promise<ActorAudit> {
  return api.get<ActorAudit>(`/xtasks/super-admin/audit/${actorId}`);
}
