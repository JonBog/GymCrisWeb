"use client";

import { useCallback, useEffect, useState } from "react";
import type { TvRutina } from "@/types/tvRutina";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://panel.gymcris.test";
const TOKEN_STORAGE_KEY = "gymcris:tv:device-token";
const POLL_INTERVAL_MS = 5 * 60 * 1000;

export function getTvToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setTvToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearTvToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export type TvRutinaState =
  | { status: "loading" }
  | { status: "no-token" }
  | { status: "invalid-token" }
  | { status: "no-rutina" }
  | { status: "error"; message: string }
  | { status: "success"; rutina: TvRutina };

async function fetchTvRutina(token: string): Promise<TvRutinaState> {
  try {
    const response = await fetch(`${API_URL}/api/public/rutina-vigente`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Device-Token": token,
      },
    });

    if (response.status === 401) return { status: "invalid-token" };
    if (response.status === 404) return { status: "no-rutina" };
    if (!response.ok) {
      return { status: "error", message: `HTTP ${response.status}` };
    }

    const rutina = (await response.json()) as TvRutina;
    return { status: "success", rutina };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Error de red",
    };
  }
}

export function useTvRutina(): {
  state: TvRutinaState;
  saveToken: (token: string) => void;
  retry: () => void;
} {
  const [state, setState] = useState<TvRutinaState>({ status: "loading" });

  const load = useCallback(async () => {
    const token = getTvToken();
    if (!token) {
      setState({ status: "no-token" });
      return;
    }
    const next = await fetchTvRutina(token);
    setState(next);
  }, []);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const saveToken = useCallback(
    (token: string) => {
      setTvToken(token.trim());
      setState({ status: "loading" });
      void load();
    },
    [load],
  );

  return { state, saveToken, retry: load };
}
