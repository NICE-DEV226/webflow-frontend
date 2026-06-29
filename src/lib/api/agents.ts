import { api } from "./client";

// ── Members ──

export interface MemberResponse {
  id: string;
  user_id: string;
  tenant_id: string;
  role_id: string | null;
  joined_at: string;
  is_owner: boolean;
  email: string | null;
}

export async function getTenantMembers(tenantId: string): Promise<MemberResponse[]> {
  return api.get<MemberResponse[]>(`/auth/tenants/${tenantId}/members`);
}

export async function removeMember(tenantId: string, userId: string): Promise<void> {
  await api.delete(`/auth/tenants/${tenantId}/members/${userId}`);
}

// ── Invites ──

export interface InviteCreate {
  tenant_id: string;
  email: string;
  role_id?: string | null;
  expires_hours?: number;
}

export interface InviteResponse {
  id: string;
  tenant_id: string;
  tenant_name: string | null;
  email: string;
  token: string;
  role_id: string | null;
  expires_at: string;
  used_at: string | null;
  is_active: boolean;
  invited_by: string;
}

export async function createInvite(data: InviteCreate): Promise<InviteResponse> {
  return api.post<InviteResponse>("/auth/invites/", data);
}

export async function getTenantInvites(tenantId: string): Promise<InviteResponse[]> {
  return api.get<InviteResponse[]>(`/auth/invites/${tenantId}`);
}

export async function cancelInvite(inviteId: string): Promise<void> {
  await api.delete(`/auth/invites/${inviteId}`);
}

// ── RBAC (Roles) ──

export interface RoleResponse {
  id: string;
  name: string;
  tenant_id: string | null;
  description: string | null;
  permissions: PermissionResponse[];
}

export interface PermissionResponse {
  id: string;
  name: string;
  description: string | null;
  source_plugin: string | null;
  tenant_grantable: boolean;
  group: string | null;
  active: boolean;
}

export interface CreateTenantRoleRequest {
  name: string;
  description?: string | null;
  permissions?: string[];
}

export async function getTenantRoles(tenantId: string): Promise<RoleResponse[]> {
  return api.get<RoleResponse[]>(`/auth/rbac/tenants/${tenantId}/roles`);
}

export async function getAllRoles(): Promise<RoleResponse[]> {
  return api.get<RoleResponse[]>("/auth/rbac/roles");
}

export async function createTenantRole(tenantId: string, data: CreateTenantRoleRequest): Promise<RoleResponse> {
  return api.post<RoleResponse>(`/auth/rbac/tenants/${tenantId}/roles`, data);
}

export async function deleteTenantRole(tenantId: string, roleId: string): Promise<void> {
  await api.delete(`/auth/rbac/tenants/${tenantId}/roles/${roleId}`);
}

export async function getGrantablePermissions(tenantId: string): Promise<PermissionResponse[]> {
  return api.get<PermissionResponse[]>(`/auth/rbac/tenants/${tenantId}/grantable`);
}

// ── RBAC (Member roles) ──

export interface AssignRoleRequest {
  role_id: string;
}

export async function setMemberRole(tenantId: string, userId: string, data: AssignRoleRequest): Promise<void> {
  await api.post(`/auth/rbac/tenants/${tenantId}/members/${userId}/role`, data);
}

export async function getMemberRoles(tenantId: string, userId: string): Promise<RoleResponse[]> {
  return api.get<RoleResponse[]>(`/auth/rbac/tenants/${tenantId}/members/${userId}/roles`);
}

export async function removeMemberRole(tenantId: string, userId: string, roleId: string): Promise<void> {
  await api.delete(`/auth/rbac/tenants/${tenantId}/members/${userId}/roles/${roleId}`);
}

export async function getMemberPermissions(tenantId: string, userId: string): Promise<PermissionResponse[]> {
  return api.get<PermissionResponse[]>(`/auth/rbac/tenants/${tenantId}/members/${userId}/permissions`);
}

// ── Legacy aliases ──

export async function inviteMember(data: InviteCreate): Promise<InviteResponse> {
  return createInvite(data);
}

export interface AuditEvent {
  actor: string;
  action: string;
  target: string;
  when: string;
}

export async function getAuditTrail(actorId: string): Promise<AuditEvent[]> {
  return api.get(`/xtasks/admin/audit/${actorId}`);
}

export async function getSuperAdminAudit(actorId: string): Promise<AuditEvent[]> {
  return api.get(`/xtasks/super-admin/audit/${actorId}`);
}

export async function getAgentEvaluations(agentId: string, serverToken?: string | null): Promise<unknown> {
  return api.get(`/xclaims/agent/claims/${agentId}/evaluate`, serverToken);
}
