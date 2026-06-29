import { api, setToken, setTenantId, setRefreshToken } from "./client";

export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  is_owner?: boolean;
  license_state?: string | null;
}

export interface TenantCreate {
  name: string;
  slug: string;
  settings?: Record<string, unknown> | null;
}

export interface SetupCreateRequest {
  refresh_token: string;
  name: string;
  slug: string;
}

export interface OrganizationCreate {
  name: string;
  description?: string | null;
  sector?: string | null;
  websiteUrl?: string | null;
  logo?: string | null;
  currency?: string;
}

export interface OrganizationSummary {
  id: string;
  tenantId: string;
  name: string;
  sector?: string | null;
  currency: string;
  activeModules: string[];
  createdAt: string;
}

export interface OrganizationResponse extends OrganizationSummary {
  tenantId: string;
  description?: string | null;
  websiteUrl?: string | null;
  logo?: string | null;
  ifu?: string | null;
  rccm?: string | null;
  currency: string;
  defaultTaxRate?: number | null;
  invoicePrefix?: string | null;
  invoiceTheme?: string | null;
  invoiceFooter?: string | null;
  autoInvoiceOnSale?: boolean;
  defaultLowStockThreshold?: number | null;
  defaultStockUnit?: string | null;
  defaultTaskPriority?: string;
  autoCreateTasksFromAlerts?: boolean;
  standardWorkStart?: string | null;
  standardWorkEnd?: string | null;
  workingDays?: number[] | null;
  defaultNoticePeriodDays?: number | null;
  updatedAt: string;
}

export async function getTenants(serverToken?: string | null): Promise<TenantResponse[]> {
  return api.get<TenantResponse[]>("/auth/tenants/", serverToken);
}

export async function createTenant(data: TenantCreate): Promise<TenantResponse> {
  return api.post<TenantResponse>("/auth/tenants/", data);
}

export async function getTenant(id: string): Promise<TenantResponse> {
  return api.get<TenantResponse>(`/auth/tenants/${id}`);
}

export async function updateTenant(id: string, data: Partial<TenantCreate>): Promise<TenantResponse> {
  return api.patch<TenantResponse>(`/auth/tenants/${id}`, data);
}

export async function deleteTenant(id: string): Promise<void> {
  return api.delete(`/auth/tenants/${id}`);
}

export async function getTenantSettings(id: string): Promise<Record<string, unknown>> {
  return api.get<Record<string, unknown>>(`/auth/tenants/${id}/settings`);
}

export async function updateTenantSettings(id: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
  return api.put<Record<string, unknown>>(`/auth/tenants/${id}/settings`, { settings });
}

export async function removeTenantMember(tenantId: string, userId: string): Promise<void> {
  return api.delete(`/auth/tenants/${tenantId}/members/${userId}`);
}

export async function setupCreate(data: SetupCreateRequest): Promise<import("./auth").TokenResponse> {
  const res = await api.post<import("./auth").TokenResponse>("/auth/setup/create", data);
  setToken(res.access_token);
  setRefreshToken(res.refresh_token);
  if (res.tenant_id) setTenantId(res.tenant_id);
  return res;
}

export async function getOrganizations(): Promise<OrganizationSummary[]> {
  return api.get<OrganizationSummary[]>("/company/organizations/");
}

export async function createOrganization(data: OrganizationCreate): Promise<OrganizationResponse> {
  return api.post<OrganizationResponse>("/company/organizations/", data);
}

export async function getOrganization(orgId: string): Promise<OrganizationResponse> {
  return api.get<OrganizationResponse>(`/company/organizations/${orgId}`);
}

export async function updateOrganization(orgId: string, data: Partial<OrganizationCreate>): Promise<OrganizationResponse> {
  return api.patch<OrganizationResponse>(`/company/organizations/${orgId}`, data);
}

export async function deleteOrganization(orgId: string): Promise<void> {
  return api.delete(`/company/organizations/${orgId}`);
}
