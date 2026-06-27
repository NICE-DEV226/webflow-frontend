import { headers } from "next/headers";

import { getTenantFromHost, type Tenant } from "./tenant";

export async function getCurrentTenant(): Promise<Tenant> {
  const host = (await headers()).get("host");
  return getTenantFromHost(host);
}
