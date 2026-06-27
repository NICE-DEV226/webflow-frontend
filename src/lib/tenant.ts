import { resolveTenant } from "@/lib/api/tenants";
import type { Tenant } from "@/lib/api/tenants";

export type { Tenant };
export { resolveTenant } from "@/lib/api/tenants";

const FALLBACK_TENANT: Tenant = {
  slug: "demo",
  name: "Demo Insurance",
  color: "#1E3A5F",
};

export async function getTenantFromHost(host?: string | null): Promise<Tenant> {
  if (!host) return FALLBACK_TENANT;
  const hostname = host.split(":")[0];
  try {
    return await resolveTenant(hostname);
  } catch {
    return FALLBACK_TENANT;
  }
}
