"use client";

import { createContext, useContext } from "react";

import { DEFAULT_TENANT, type Tenant } from "@/lib/tenant";

const TenantContext = createContext<Tenant>(DEFAULT_TENANT);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
