"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTvToken, setTvToken, pairCode, pollToken } from "@/lib/tvApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://panel.gymcris.test";
const PANEL_URL_DISPLAY = `${API_URL}/configuracion/tv-devices`.replace(
  /^https?:\/\//,
  "",
);

const POLL_MS = 5000;
const RATE_LIMIT_POLL_BACKOFF_MS = 10000;
const RATE_LIMIT_PAIR_BACKOFF_MS = 60000;
const ERROR_RETRY_MS = 3000;

type ScreenState =
  | { kind: "initializing" }
  | { kind: "ready"; code: string; expiresAt: string }
  | { kind: "rate-limited" }
  | { kind: "error"; message: string };

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export default function TvSetupPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState>({ kind: "initializing" });
  const [status, setStatus] = useState("Generando codigo...");
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentCode: string | null = null;
    let currentExpiresMs = 0;

    async function generateCode(): Promise<boolean> {
      if (cancelled) return false;
      setScreen({ kind: "initializing" });
      setStatus("Generando codigo...");
      const result = await pairCode();
      if (cancelled) return false;
      if (result.kind === "rate-limit") {
        setScreen({ kind: "rate-limited" });
        setStatus("Muchos intentos. Reintentando en 60s");
        await sleep(RATE_LIMIT_PAIR_BACKOFF_MS);
        return cancelled ? false : generateCode();
      }
      if (result.kind === "error") {
        setScreen({ kind: "error", message: result.message });
        setStatus("Error de conexion. Reintentando...");
        await sleep(ERROR_RETRY_MS);
        return cancelled ? false : generateCode();
      }
      currentCode = result.data.code;
      currentExpiresMs = new Date(result.data.expires_at).getTime();
      setScreen({
        kind: "ready",
        code: result.data.code,
        expiresAt: result.data.expires_at,
      });
      setStatus("Esperando emparejamiento...");
      return true;
    }

    async function loop() {
      if (getTvToken()) {
        router.replace("/tv/rutinas");
        return;
      }
      const ok = await generateCode();
      if (!ok) return;

      while (!cancelled) {
        await sleep(POLL_MS);
        if (cancelled) return;
        if (!currentCode) continue;

        if (Date.now() > currentExpiresMs) {
          await generateCode();
          continue;
        }

        const result = await pollToken(currentCode);
        if (cancelled) return;

        if (result.kind === "paired") {
          setTvToken(result.token);
          router.replace("/tv/rutinas");
          return;
        }
        if (result.kind === "expired" || result.kind === "invalid") {
          await generateCode();
          continue;
        }
        if (result.kind === "rate-limit") {
          setStatus("Rate limit del poll. Esperando...");
          await sleep(RATE_LIMIT_POLL_BACKOFF_MS);
          if (!cancelled) setStatus("Esperando emparejamiento...");
          continue;
        }
        if (result.kind === "error") {
          setStatus(`Error de red. Reintentando...`);
          await sleep(ERROR_RETRY_MS);
          if (!cancelled) setStatus("Esperando emparejamiento...");
          continue;
        }
        // pending: seguimos poleando
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (screen.kind !== "ready") {
      setRemaining(null);
      return;
    }
    const update = () => {
      const ms = new Date(screen.expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, Math.floor(ms / 1000)));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [screen]);

  const code = screen.kind === "ready" ? screen.code : null;
  const countdown =
    remaining !== null
      ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
      : null;
  const digits = (code ?? "------").split("");

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-10 select-none">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
        <Image
          src="/icons/icon-512.png"
          alt="GymCris"
          width={48}
          height={48}
          className="w-6 h-6"
        />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#ffd700] font-bold">
          · TV
        </span>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4 text-center leading-none">
        Emparejá esta TV
      </h1>

      <p className="text-white/50 text-sm md:text-base mb-12 text-center">
        Ingresá este código en el panel de administración
      </p>

      <div className="flex gap-4 md:gap-6 lg:gap-10 font-mono text-[5rem] md:text-[8rem] lg:text-[10rem] font-black leading-none tabular-nums mb-10">
        {digits.map((ch, i) => (
          <span key={i} className={code ? "text-[#ffd700]" : "text-white/10"}>
            {code ? ch : "·"}
          </span>
        ))}
      </div>

      {countdown && (
        <p className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-8">
          Expira en {countdown}
        </p>
      )}

      <div className="flex items-center gap-3 text-white/60 text-xs md:text-sm font-mono mb-16">
        <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
        <span className="uppercase tracking-[0.25em]">{status}</span>
      </div>

      <p className="text-white/25 text-[0.7rem] font-mono uppercase tracking-[0.25em] text-center">
        {PANEL_URL_DISPLAY}
      </p>
    </div>
  );
}
