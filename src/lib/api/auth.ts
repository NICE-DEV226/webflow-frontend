import { api, ApiError, setToken, setTenantId, setRefreshToken } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id?: string | null;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id?: string | null;
  tenant_id?: string | null;
  mfa_required?: boolean;
  mfa_token?: string | null;
  onboarding_required?: boolean;
  tenants?: TenantInfo[] | null;
}

export interface TenantInfo {
  id: string;
  name?: string | null;
  slug?: string | null;
  role_id?: string | null;
  is_owner?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  is_active: boolean;
  mfa_enabled: boolean;
  has_password?: boolean;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", data);
  if (!res.access_token) {
    console.error("[login] Réponse sans access_token :", JSON.stringify(res));
    throw new ApiError(500, "Le serveur n'a pas retourné de jeton d'accès");
  }
  setToken(res.access_token);
  setRefreshToken(res.refresh_token);
  if (res.tenant_id) setTenantId(res.tenant_id);
  return res;
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  return api.post<UserResponse>("/auth/register", data);
}

export async function getMe(serverToken?: string | null): Promise<UserResponse> {
  return api.get<UserResponse>("/auth/me", serverToken);
}

export function logout() {
  setToken(null);
  setRefreshToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("claimflow_tenant_id");
  }
}
