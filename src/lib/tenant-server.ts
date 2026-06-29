import { headers } from "next/headers";

import { getTenantFromHost, type TenantResponse } from "./tenant";

export async function getCurrentTenant(): Promise<TenantResponse> {
  const host = (await headers()).get("host");
  return getTenantFromHost(host);
}
