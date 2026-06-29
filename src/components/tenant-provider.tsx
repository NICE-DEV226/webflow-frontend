"use client";

import { createContext, useContext } from "react";

import { type TenantResponse } from "@/lib/tenant";

const FALLBACK: TenantResponse & { color: string } = { id: "", slug: "demo", name: "Demo Insurance", color: "#1E3A5F", created_at: "" };

const TenantContext = createContext<TenantResponse & { color: string }>(FALLBACK);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: TenantResponse;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={{ ...tenant, color: "#1E3A5F" }}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
