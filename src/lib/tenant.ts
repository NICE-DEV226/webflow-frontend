import { getTenants } from "@/lib/api/tenants";
import type { TenantResponse } from "@/lib/api/tenants";

export type { TenantResponse };
export { getTenants } from "@/lib/api/tenants";

const FALLBACK_TENANT: TenantResponse = {
  id: "",
  name: "Demo Insurance",
  slug: "demo",
  created_at: "",
};

export async function getTenantFromHost(host?: string | null): Promise<TenantResponse> {
  if (!host) return FALLBACK_TENANT;
  const hostname = host.split(":")[0];
  try {
    const tenants = await getTenants();
    return tenants.find((t) => t.slug === hostname) ?? FALLBACK_TENANT;
  } catch {
    return FALLBACK_TENANT;
  }
}
