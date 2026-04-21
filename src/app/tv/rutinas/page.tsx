"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTvRutina } from "@/lib/tvApi";
import { TvQR } from "@/components/tv/TvQR";
import type { TvRutina } from "@/types/tvRutina";

const ROTATE_SECONDS = 10;

function useClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function TVRutinasPage() {
  const router = useRouter();
  const { state } = useTvRutina();

  useEffect(() => {
    if (state.status === "no-token" || state.status === "invalid-token") {
      router.replace("/tv/setup");
    }
  }, [state.status, router]);

  if (state.status === "no-token" || state.status === "invalid-token") {
    return <TvStatusScreen label="Redirigiendo…" />;
  }
  if (state.status === "loading") return <TvStatusScreen label="Cargando rutina…" />;
  if (state.status === "no-rutina") {
    return <TvStatusScreen label="No hay rutina vigente" sublabel="Cargá una rutina desde el panel" />;
  }
  if (state.status === "error") {
    return <TvStatusScreen label="Error de conexión" sublabel={state.message} />;
  }

  return <TVRutinasView rutina={state.rutina} />;
}

function TvStatusScreen({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <div className="h-screen bg-[#050505] text-white flex items-center justify-center select-none">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-black text-[#ffd700] uppercase tracking-tighter mb-3">
          {label}
        </h1>
        {sublabel && <p className="text-white/50 text-sm font-mono">{sublabel}</p>}
      </div>
    </div>
  );
}

function TVRutinasView({ rutina }: { rutina: TvRutina }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const clock = useClock();

  const totalDays = rutina.dias.length;
  const diaActual = rutina.dias[activeDayIndex] ?? rutina.dias[0];

  const goToDay = useCallback((index: number) => {
    setActiveDayIndex(index);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (activeDayIndex >= totalDays) setActiveDayIndex(0);
  }, [activeDayIndex, totalDays]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveDayIndex((prev) => (prev + 1) % totalDays);
      setProgressKey((k) => k + 1);
    }, ROTATE_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [isPaused, totalDays]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToDay((activeDayIndex + 1) % totalDays);
      } else if (e.key === "ArrowLeft") {
        goToDay((activeDayIndex - 1 + totalDays) % totalDays);
      } else if (e.key === "p" || e.key === "P") {
        setIsPaused((prev) => !prev);
      } else if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (idx < totalDays) goToDay(idx);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeDayIndex, totalDays, goToDay]);

  const grouped: Record<string, typeof diaActual.ejercicios> = {};
  diaActual.ejercicios.forEach((ej) => {
    if (!grouped[ej.grupo]) grouped[ej.grupo] = [];
    grouped[ej.grupo].push(ej);
  });
  const groupEntries = Object.entries(grouped);

  const formattedTime = clock
    ? clock.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";
  const formattedDate = clock
    ? clock.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden cursor-none select-none">

      {/* ===== TOP BAR ===== */}
      <header className="flex items-center justify-between px-10 py-2 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-xl font-black text-[#ffd700] uppercase tracking-tighter">
            GymCris
          </h1>
          <div className="h-5 w-px bg-[rgba(255,215,0,0.25)]" />
          <p className="text-white/50 text-xs font-mono uppercase tracking-wider">{rutina.nombre}</p>
        </div>

        <div className="flex items-center gap-6">
          {isPaused && (
            <span className="text-[#ffd700] text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
              ⏸ Pausado
            </span>
          )}
          <div className="text-right flex items-center gap-3">
            <p className="text-white/40 text-xs capitalize">{formattedDate}</p>
            <p className="font-mono text-2xl font-bold tracking-tight leading-none">{formattedTime}</p>
          </div>
        </div>
      </header>

      {/* ===== DAY TABS ===== */}
      <div className="flex shrink-0 border-y border-[rgba(255,215,0,0.1)]">
        {rutina.dias.map((dia, i) => {
          const isActive = i === activeDayIndex;
          return (
            <button
              key={i}
              onClick={() => goToDay(i)}
              className={`flex-1 py-1.5 px-2 transition-all duration-500 text-center relative ${
                isActive
                  ? "bg-[#ffd700] text-[#050505]"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
              }`}
            >
              <span className="block text-[0.5rem] font-mono font-bold uppercase tracking-[0.2em]">
                {dia.tag}
              </span>
              <span className={`block text-[0.6rem] font-bold uppercase tracking-tight ${isActive ? "" : "hidden lg:block"}`}>
                {dia.nombre}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="h-1 bg-[rgba(255,215,0,0.08)] shrink-0">
        {!isPaused && (
          <div
            key={progressKey}
            className="h-full bg-[#ffd700]"
            style={{ animation: `progress ${ROTATE_SECONDS}s linear` }}
          />
        )}
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>

      {/* ===== MAIN ===== */}
      <main className="flex-1 px-10 py-3 overflow-hidden flex flex-col">
        {/* Day title */}
        <div className="flex items-center justify-between gap-6 mb-3 shrink-0">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-mono text-[0.65rem] text-[#ffd700] font-bold uppercase tracking-[0.3em] shrink-0">
              {diaActual.tag}
            </span>
            <h2 className="font-heading text-xl lg:text-2xl font-black uppercase tracking-wide leading-none truncate">
              {diaActual.nombre}
            </h2>
          </div>
          <span className="text-white/30 font-mono text-[0.65rem] uppercase tracking-[0.2em] shrink-0">
            {diaActual.ejercicios.length} ejercicios
          </span>
        </div>

        {/* Exercises — 2 column grid grouped by muscle */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 content-start overflow-hidden">
          {groupEntries.map(([grupo, ejercicios]) => (
            <div key={grupo} className="min-w-0">
              {/* Group label */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#ffd700] font-heading text-[0.6875rem] font-bold uppercase tracking-[0.35em] shrink-0">
                  {grupo}
                </span>
                <div className="flex-1 h-px bg-[rgba(255,215,0,0.12)]" />
              </div>

              {/* Exercises */}
              {ejercicios.map((ej, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-1 px-3 rounded-md odd:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[#ffd700]/25 font-mono text-xs font-bold w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base lg:text-lg font-medium uppercase tracking-wide truncate">
                      {ej.nombre}
                    </span>
                  </div>
                  <span className="font-mono text-sm lg:text-base text-[#ffd700] font-bold shrink-0 tabular-nums">
                    {ej.series}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* ===== BANNER + QR ===== */}
      <div className="shrink-0 h-[6rem] bg-[#0a0a0a] border-t border-white/[0.06] flex items-center overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, copy) => (
              <div key={copy} className="flex items-center gap-12 px-6">
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">HORARIOS</span>
                  <span className="text-white/60 ml-2">Lun-Vie 06:30 a 23:30 · Sáb 08:00 a 18:00 · Domingos cerrado</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">GYMCRIS</span>
                  <span className="text-white/60 ml-2">Desde 1997 en González Catán · 27 años transformando vidas</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">UBICACIÓN</span>
                  <span className="text-white/60 ml-2">Río de la Plata 7462 · González Catán</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">CONTACTO</span>
                  <span className="text-white/60 ml-2">WhatsApp +54 11 6252-2431 · Instagram @gimnasiocris1997</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 h-full flex items-center gap-3 px-4 border-l border-white/[0.06]">
          <TvQR path="/socio/rutina" size={88} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#ffd700] leading-none mb-1">Escaneá</p>
            <p className="text-[0.6rem] text-white/60 leading-tight">Ver rutina<br />en tu celular</p>
          </div>
        </div>

      </div>

    </div>
  );
}
