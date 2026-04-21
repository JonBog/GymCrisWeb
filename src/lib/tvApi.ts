"use client";

import { useCallback, useEffect, useState } from "react";
import type { TvRutina } from "@/types/tvRutina";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://panel.gymcris.test";
const TOKEN_STORAGE_KEY = "tv_token";
const RUTINA_POLL_MS = 5 * 60 * 1000;

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

    if (response.status === 401) {
      clearTvToken();
      return { status: "invalid-token" };
    }
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

export function useTvRutina(): { state: TvRutinaState } {
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
    const timer = setInterval(() => void load(), RUTINA_POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  return { state };
}

// ============================================================
// Pair-code flow (Netflix/Spotify style)
// ============================================================

export type PairCodeSuccess = {
  code: string;
  expires_at: string;
  poll_url: string;
};

export type PairCodeResult =
  | { kind: "ok"; data: PairCodeSuccess }
  | { kind: "rate-limit" }
  | { kind: "error"; message: string };

export async function pairCode(): Promise<PairCodeResult> {
  try {
    const response = await fetch(`${API_URL}/api/public/tv/pair-code`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    if (response.status === 429) return { kind: "rate-limit" };
    if (!response.ok) {
      return { kind: "error", message: `HTTP ${response.status}` };
    }
    const data = (await response.json()) as PairCodeSuccess;
    return { kind: "ok", data };
  } catch (err) {
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Error de red",
    };
  }
}

export type PollTokenResult =
  | { kind: "pending"; expires_at: string }
  | { kind: "paired"; token: string }
  | { kind: "expired" }
  | { kind: "invalid" }
  | { kind: "rate-limit" }
  | { kind: "error"; message: string };

export async function pollToken(code: string): Promise<PollTokenResult> {
  try {
    const response = await fetch(
      `${API_URL}/api/public/tv/poll-token?code=${encodeURIComponent(code)}`,
      { headers: { Accept: "application/json" } },
    );
    if (response.status === 429) return { kind: "rate-limit" };
    if (response.status === 404) {
      const data = await response.json().catch(() => null);
      const kind = data?.status === "invalid" ? "invalid" : "expired";
      return { kind } as PollTokenResult;
    }
    if (!response.ok) {
      return { kind: "error", message: `HTTP ${response.status}` };
    }
    const data = (await response.json()) as {
      status: "pending" | "paired";
      token?: string;
      expires_at?: string;
    };
    if (data.status === "paired" && data.token) {
      return { kind: "paired", token: data.token };
    }
    return { kind: "pending", expires_at: data.expires_at ?? "" };
  } catch (err) {
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Error de red",
    };
  }
}
