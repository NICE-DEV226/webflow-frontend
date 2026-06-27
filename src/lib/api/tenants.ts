import { api } from "./client";

export interface Tenant {
  slug: string;
  name: string;
  color: string;
  logoUrl?: string | null;
  brandName?: string;
}

export interface BrandingConfig {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface CompanyInfo {
  country: string;
  sector: string;
  agentCount: number;
}

export type PlanTier = "starter" | "growth" | "enterprise";

export interface ExtendedTenant extends Tenant {
  email: string;
  branding: BrandingConfig;
  company: CompanyInfo;
  plan: PlanTier;
  trialEndsAt: string;
  createdAt: string;
}

export async function getTenant(slug: string): Promise<ExtendedTenant> {
  return api.get<ExtendedTenant>(`/tenants/${slug}`);
}

export async function resolveTenant(host: string): Promise<Tenant> {
  return api.get<Tenant>(`/tenants/resolve?host=${encodeURIComponent(host)}`);
}

export async function createTenant(data: {
  slug: string;
  name: string;
  email: string;
}): Promise<ExtendedTenant> {
  return api.post<ExtendedTenant>("/tenants", data);
}

export async function updateTenantBranding(
  slug: string,
  branding: BrandingConfig,
): Promise<ExtendedTenant> {
  return api.put<ExtendedTenant>(`/tenants/${slug}/branding`, branding);
}

export async function updateTenantInfo(
  slug: string,
  info: { name?: string; email?: string },
): Promise<ExtendedTenant> {
  return api.put<ExtendedTenant>(`/tenants/${slug}`, info);
}

export async function saveOnboardingCompany(
  data: { slug: string; name: string } & CompanyInfo,
): Promise<{ sessionId: string }> {
  return api.post("/onboarding/company", data);
}

export async function saveOnboardingBranding(
  sessionId: string,
  branding: BrandingConfig,
): Promise<{ sessionId: string }> {
  return api.put(`/onboarding/${sessionId}/branding`, branding);
}

export async function saveOnboardingPlan(
  sessionId: string,
  plan: PlanTier,
): Promise<{ sessionId: string }> {
  return api.put(`/onboarding/${sessionId}/plan`, { plan });
}

export async function getOnboardingData(
  sessionId: string,
): Promise<{ company: CompanyInfo; branding: BrandingConfig; plan: PlanTier }> {
  return api.get(`/onboarding/${sessionId}`);
}

export async function completeOnboarding(sessionId: string): Promise<ExtendedTenant> {
  return api.post(`/onboarding/${sessionId}/complete`);
}
