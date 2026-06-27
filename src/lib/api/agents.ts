import { api } from "./client";

export interface Agent {
  id: string;
  name: string;
  email: string;
  active: boolean;
  handled: number;
}

export interface AuditEvent {
  actor: string;
  action: string;
  target: string;
  when: string;
}

export async function getAgents(tenantSlug: string): Promise<Agent[]> {
  return api.get<Agent[]>(`/tenants/${tenantSlug}/agents`);
}

export async function inviteAgent(
  tenantSlug: string,
  data: { name: string; email: string },
): Promise<Agent> {
  return api.post<Agent>(`/tenants/${tenantSlug}/agents`, data);
}

export async function toggleAgentStatus(
  tenantSlug: string,
  agentId: string,
): Promise<Agent> {
  return api.patch<Agent>(`/tenants/${tenantSlug}/agents/${agentId}/toggle`);
}

export async function getAuditTrail(tenantSlug: string): Promise<AuditEvent[]> {
  return api.get<AuditEvent[]>(`/tenants/${tenantSlug}/audit`);
}

export async function getAgentEvaluations(agentId: string): Promise<unknown[]> {
  return api.get(`/agents/${agentId}/evaluations`);
}
