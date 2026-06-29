const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/app";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    const detail =
      data && typeof data === "object" && "detail" in data
        ? String((data as Record<string, unknown>).detail)
        : message;
    super(detail);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("claimflow_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("claimflow_token", token);
    document.cookie = `claimflow_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem("claimflow_token");
    document.cookie = "claimflow_token=; path=/; max-age=0";
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("claimflow_refresh_token");
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("claimflow_refresh_token", token);
    document.cookie = `claimflow_refresh_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem("claimflow_refresh_token");
    document.cookie = "claimflow_refresh_token=; path=/; max-age=0";
  }
}

export function getTenantId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("claimflow_tenant_id");
}

export function setTenantId(tenantId: string | null) {
  if (typeof window === "undefined") return;
  if (tenantId) {
    localStorage.setItem("claimflow_tenant_id", tenantId);
    document.cookie = `claimflow_tenant_id=${tenantId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem("claimflow_tenant_id");
    document.cookie = "claimflow_tenant_id=; path=/; max-age=0";
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  serverToken?: string | null,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = serverToken ?? getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    throw new ApiError(res.status, res.statusText, data);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, serverToken?: string | null) => request<T>(path, {}, serverToken),
  post: <T>(path: string, body?: unknown, serverToken?: string | null) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }, serverToken),
  put: <T>(path: string, body?: unknown, serverToken?: string | null) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }, serverToken),
  patch: <T>(path: string, body?: unknown, serverToken?: string | null) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }, serverToken),
  delete: <T>(path: string, serverToken?: string | null) => request<T>(path, { method: "DELETE" }, serverToken),
};
