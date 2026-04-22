"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTvRutina } from "@/lib/tvApi";
import { TvQR } from "@/components/tv/TvQR";
import type { TvRutina } from "@/types/tvRutina";

function useClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function TVRutinas2Page() {
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

  return <TVRutinas2View rutina={state.rutina} />;
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

function TVRutinas2View({ rutina }: { rutina: TvRutina }) {
  const clock = useClock();

  const formattedTime = clock
    ? clock.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";

  const formattedDate = clock
    ? clock.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden cursor-none select-none">
      {/* ===== TOP BAR ===== */}
      <header className="flex items-center justify-between px-6 py-2 shrink-0">
        <div className="flex items-center gap-4">
          <Image
            src="/icons/icon-512.png"
            alt="GymCris"
            width={72}
            height={72}
            className="w-9 h-9"
            priority
          />
          <div className="h-5 w-px bg-[rgba(255,215,0,0.25)]" />
          <span className="text-white/50 text-xs font-mono uppercase tracking-wider">
            {rutina.nombre}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs capitalize">{formattedDate}</span>
          <span className="font-mono text-2xl font-bold tracking-tight">{formattedTime}</span>
        </div>
      </header>

      {/* ===== 5 COLUMNS ===== */}
      <main className="flex-1 grid grid-cols-5 grid-rows-1 gap-2 px-3 overflow-hidden">
          {rutina.dias.map((dia, dayIndex) => (
            <div
              key={dayIndex}
              className="flex flex-col overflow-hidden rounded-lg bg-[#0a0a0a] border border-white/[0.06]"
            >
            {/* Day header */}
            <div className="px-3 py-2 border-b-2 border-[#ffd700] bg-[rgba(255,215,0,0.06)] shrink-0 h-[3rem] flex items-center">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[0.5rem] text-[#ffd700] uppercase tracking-[0.3em] font-bold shrink-0">
                  {dia.tag}
                </span>
                <h2 className="font-heading text-xs font-black uppercase tracking-wide leading-tight">
                  {dia.nombre}
                </h2>
              </div>
            </div>

            {/* Exercises list */}
            <div className="flex-1 overflow-hidden px-1">
              {dia.ejercicios.map((ej, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 rounded ${
                    i % 2 !== 0 ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <p className="text-[0.75rem] leading-tight font-medium uppercase tracking-wide break-words">
                    {ej.nombre}
                  </p>
                  <p className="font-mono text-[0.6rem] text-[#ffd700] font-bold tabular-nums leading-none">
                    {ej.series}
                  </p>
                </div>
              ))}
            </div>

            {/* Day footer */}
            <div className="px-3 py-1 border-t border-white/[0.06] shrink-0">
              <span className="text-[0.5rem] text-white/25 font-mono">
                {dia.ejercicios.length} ejercicios
              </span>
            </div>
          </div>
          ))}
      </main>

      {/* ===== BANNER + QR ===== */}
      <div className="shrink-0 h-[6rem] bg-[#0a0a0a] border-t border-white/[0.06] flex items-center overflow-hidden">
        {/* Marquee */}
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
                  <span className="text-white/60 ml-2">Desde 1997 en Virrey del Pino · 29 años transformando vidas</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">UBICACIÓN</span>
                  <span className="text-white/60 ml-2">Río de la Plata 7462 · Virrey del Pino</span>
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
