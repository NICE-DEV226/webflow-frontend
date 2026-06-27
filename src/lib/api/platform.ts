import { api } from "./client";

export interface PlatformMetrics {
  totalTenants: number;
  totalClaims: number;
  activeUsers: number;
  monthlyRevenue: number;
}

export interface PlatformTenant {
  slug: string;
  name: string;
  plan: string;
  status: "active" | "suspended";
  trialEndsAt: string;
}

export interface PlatformLicense {
  tenantSlug: string;
  tenantName: string;
  plan: string;
  status: "active" | "trial" | "expired";
  trialEndsAt: string;
}

export interface PlatformAuditEvent {
  actor: string;
  action: string;
  target: string;
  when: string;
  tenantSlug?: string;
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  return api.get<PlatformMetrics>("/platform/metrics");
}

export async function getPlatformTenants(): Promise<PlatformTenant[]> {
  return api.get<PlatformTenant[]>("/platform/tenants");
}

export async function suspendTenant(slug: string): Promise<void> {
  return api.post(`/platform/tenants/${slug}/suspend`);
}

export async function activateTenant(slug: string): Promise<void> {
  return api.post(`/platform/tenants/${slug}/activate`);
}

export async function getPlatformLicenses(): Promise<PlatformLicense[]> {
  return api.get<PlatformLicense[]>("/platform/licenses");
}

export async function getPlatformAudit(): Promise<PlatformAuditEvent[]> {
  return api.get<PlatformAuditEvent[]>("/platform/audit");
}
