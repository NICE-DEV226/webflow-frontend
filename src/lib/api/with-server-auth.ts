import "server-only";
import { cookies } from "next/headers";

export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("claimflow_token")?.value ?? null;
  } catch {
    return null;
  }
}

export async function getServerRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("claimflow_refresh_token")?.value ?? null;
  } catch {
    return null;
  }
}

export async function getServerTenantId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("claimflow_tenant_id")?.value ?? null;
  } catch {
    return null;
  }
}
