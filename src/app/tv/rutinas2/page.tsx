"use client";

import { useState, useEffect } from "react";

const RUTINA_MOCK = {
  nombre: "Abril 2026 — Semana 1-2",
  fechaDesde: "01/04",
  fechaHasta: "15/04",
  dias: [
    {
      nombre: "Pecho + Tríceps",
      tag: "DÍA 1",
      ejercicios: [
        { nombre: "Press plano c/barra", series: "4 x 10" },
        { nombre: "Press inclinado c/manc.", series: "12-10-8-6" },
        { nombre: "Apertura en máquina", series: "4 x 12" },
        { nombre: "Cruce c/cables", series: "4 x 15" },
        { nombre: "Fondos", series: "4 x fallo" },
        { nombre: "Polea alta c/soga", series: "Drop set" },
        { nombre: "Press Francés c/barra", series: "4 x 12" },
        { nombre: "Copa c/manc.", series: "4 x 10" },
        { nombre: "Polea alta c/triángulo", series: "Rest pause" },
      ],
    },
    {
      nombre: "Espalda + Bíceps",
      tag: "DÍA 2",
      ejercicios: [
        { nombre: "Dominadas", series: "4 x fallo" },
        { nombre: "Jalón abierto al pecho", series: "4 x 12" },
        { nombre: "Remo c/barra prono", series: "12-10-8-6" },
        { nombre: "Remo en polea cerrado", series: "4 x 10" },
        { nombre: "Pull over c/soga", series: "4 x 15" },
        { nombre: "Curl c/barra parado", series: "Drop set" },
        { nombre: "Martillo c/manc.", series: "4 x 10" },
        { nombre: "Curl banco inclinado", series: "12-10-8-6" },
        { nombre: "Polea baja c/barra", series: "4 x 12" },
      ],
    },
    {
      nombre: "Cuádriceps + Glúteos",
      tag: "DÍA 3",
      ejercicios: [
        { nombre: "Sentadilla libre", series: "12-10-8-6" },
        { nombre: "Prensa", series: "4 x 15" },
        { nombre: "Sentadilla Hack 45", series: "4 x 12" },
        { nombre: "Sillón de cuádriceps", series: "Drop set" },
        { nombre: "Hip thrust", series: "4 x 10" },
        { nombre: "Sentadilla Búlgara", series: "12-10-8-6" },
        { nombre: "Patada en máquina", series: "4 x 15" },
        { nombre: "Abducción en máquina", series: "4 x 20" },
      ],
    },
    {
      nombre: "Hombros + Trapecios",
      tag: "DÍA 4",
      ejercicios: [
        { nombre: "Press Militar c/manc.", series: "12-10-8-6" },
        { nombre: "Vuelo lateral c/manc.", series: "4 x 15" },
        { nombre: "Vuelo frontal c/barra", series: "4 x 12" },
        { nombre: "Posterior en máquina", series: "4 x 15" },
        { nombre: "Vuelo de pájaro", series: "Rest pause" },
        { nombre: "Encogimiento c/barra", series: "4 x 12" },
        { nombre: "Encogimiento c/manc.", series: "4 x 15" },
        { nombre: "Remo al mentón", series: "12-10-8-6" },
      ],
    },
    {
      nombre: "Femorales + Pantorrillas + Core",
      tag: "DÍA 5",
      ejercicios: [
        { nombre: "Peso muerto c/barra", series: "12-10-8-6" },
        { nombre: "Camilla", series: "4 x 12" },
        { nombre: "Buenos Días c/barra", series: "4 x 10" },
        { nombre: "Sillón femoral", series: "Drop set" },
        { nombre: "Pantorrilla en máquina", series: "4 x 20" },
        { nombre: "Pantorrilla sentada", series: "4 x 15" },
        { nombre: "Crunch c/soga", series: "4 x 20" },
        { nombre: "Plancha", series: "4 x 30s" },
        { nombre: "Elevación de piernas", series: "4 x 15" },
      ],
    },
  ],
};

function useClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function TVRutinas2() {
  const clock = useClock();
  const rutina = RUTINA_MOCK;

  const formattedTime = clock
    ? clock.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
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
          <h1 className="font-heading text-xl font-black text-[#ffd700] uppercase tracking-tighter">
            GymCris
          </h1>
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
      <main className="flex-1 grid grid-cols-5 gap-2 px-3 overflow-hidden">
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
                <h2 className="font-heading text-xs font-black uppercase tracking-tight leading-tight">
                  {dia.nombre}
                </h2>
              </div>
            </div>

            {/* Exercises list */}
            <div className="flex-1 overflow-hidden px-1">
              {dia.ejercicios.map((ej, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded ${
                    i % 2 !== 0 ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[0.7rem] leading-snug font-medium truncate">
                      {ej.nombre}
                    </span>
                    <span className="font-mono text-[0.6rem] text-[#ffd700] font-bold shrink-0 tabular-nums">
                      {ej.series}
                    </span>
                  </div>
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
      <div className="shrink-0 h-[5rem] bg-[#0a0a0a] border-t border-white/[0.06] flex items-center overflow-hidden">
        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, copy) => (
              <div key={copy} className="flex items-center gap-12 px-6">
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">PROMO</span>
                  <span className="text-white/60 ml-2">Musculación + Libre — $15.000/mes</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">NUEVO</span>
                  <span className="text-white/60 ml-2">Clases de funcional — Lunes y Miércoles 19hs</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">HORARIOS</span>
                  <span className="text-white/60 ml-2">Lunes a Viernes 7:00 a 22:00 — Sábados 8:00 a 14:00</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
                <span className="text-[0.6rem] font-heading uppercase tracking-wide">
                  <span className="text-[#ffd700] font-bold">GYMCRIS</span>
                  <span className="text-white/60 ml-2">Desde 1997 en González Catán — Más de 27 años transformando vidas</span>
                </span>
                <span className="text-[#ffd700]/30">★</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR */}
        <div className="shrink-0 h-full flex items-center gap-2 px-4 border-l border-white/[0.06]">
          <div className="w-[3.8rem] h-[3.8rem] bg-white rounded-lg p-1">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="white" />
              <g fill="#050505">
                <rect x="4" y="4" width="24" height="24" />
                <rect x="8" y="8" width="16" height="16" fill="white" />
                <rect x="12" y="12" width="8" height="8" />
                <rect x="72" y="4" width="24" height="24" />
                <rect x="76" y="8" width="16" height="16" fill="white" />
                <rect x="80" y="12" width="8" height="8" />
                <rect x="4" y="72" width="24" height="24" />
                <rect x="8" y="76" width="16" height="16" fill="white" />
                <rect x="12" y="80" width="8" height="8" />
                <rect x="36" y="4" width="4" height="4" />
                <rect x="44" y="4" width="4" height="4" />
                <rect x="52" y="4" width="4" height="4" />
                <rect x="36" y="12" width="4" height="4" />
                <rect x="48" y="12" width="4" height="4" />
                <rect x="60" y="12" width="4" height="4" />
                <rect x="36" y="36" width="4" height="4" />
                <rect x="44" y="40" width="4" height="4" />
                <rect x="52" y="36" width="4" height="4" />
                <rect x="60" y="44" width="4" height="4" />
                <rect x="40" y="52" width="4" height="4" />
                <rect x="52" y="52" width="4" height="4" />
                <rect x="44" y="60" width="4" height="4" />
                <rect x="72" y="36" width="4" height="4" />
                <rect x="80" y="44" width="4" height="4" />
                <rect x="88" y="36" width="4" height="4" />
                <rect x="72" y="52" width="4" height="4" />
                <rect x="84" y="56" width="4" height="4" />
              </g>
            </svg>
          </div>
          <div>
            <p className="text-[0.5rem] font-bold uppercase tracking-wide text-[#ffd700] leading-none">Escaneá</p>
            <p className="text-[0.4rem] text-white/40 leading-tight">Ver rutina en tu cel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
