"use client";

import { createContext, useContext } from "react";

import { type Tenant } from "@/lib/tenant";

const FALLBACK: Tenant = { slug: "demo", name: "Demo Insurance", color: "#1E3A5F" };

const TenantContext = createContext<Tenant>(FALLBACK);

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
