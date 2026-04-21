"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, apiFetch } from "@/lib/api";

export type AuthUser = {
  id: number;
  codigo_socio: string;
  Nombre: string;
  Apellido: string;
  nombre_completo: string;
  DNI: string;
  Email: string | null;
  Telefono: string | null;
  telefono_formateado: string | null;
  FechaNacimiento: string | null;
  FechaAlta: string | null;
  UltimoLoginAt: string | null;
  Activo: boolean;
};

type AuthStatus = "loading" | "authenticated" | "guest";

type LoginCredentials = {
  dni: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const response = await apiFetch<{ user: AuthUser }>("/api/socio/me");
      setUser(response.user);
      setStatus("authenticated");
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 419)) {
        setUser(null);
        setStatus("guest");
        return;
      }
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ dni, password }: LoginCredentials) => {
    const response = await apiFetch<{ user: AuthUser }>("/api/socio/login", {
      method: "POST",
      body: { dni, password },
    });
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/socio/logout", { method: "POST" });
    } finally {
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refresh,
    }),
    [user, status, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
