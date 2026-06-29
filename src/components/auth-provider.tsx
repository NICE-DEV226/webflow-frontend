"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";
import { getMe, logout as apiLogout, type UserResponse } from "@/lib/api/auth";
import { getTenantId, getToken } from "@/lib/api/client";

interface AuthContextValue {
  user: UserResponse | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
  tenantId: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: () => {},
  tenantId: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantIdState] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    try {
      const u = await getMe();
      setUser(u);
      setTenantIdState(getTenantId());
    } catch {
      setUser(null);
      setTenantIdState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setTenantIdState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, tenantId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
