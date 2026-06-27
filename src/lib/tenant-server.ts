import { headers } from "next/headers";

import { getTenantFromHost, type Tenant } from "./tenant";

/** Résout le tenant courant côté serveur (depuis le host). Server Components only. */
export async function getCurrentTenant(): Promise<Tenant> {
  const host = (await headers()).get("host");
  return getTenantFromHost(host);
}
