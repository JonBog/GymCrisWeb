"use client";

import { useState, useEffect, useCallback } from "react";

/* ============================================================
   MOCK DATA — después se reemplaza por fetch a la API de Laravel
   GET /api/routines/tv
   ============================================================ */
const RUTINA_MOCK = {
  nombre: "Abril 2026 — Semana 1-2",
  fechaDesde: "01/04",
  fechaHasta: "15/04",
  dias: [
    {
      nombre: "Pecho + Tríceps",
      tag: "DÍA 1",
      ejercicios: [
        { nombre: "Press plano c/barra", grupo: "Pectorales", series: "4 x 10" },
        { nombre: "Press inclinado c/manc.", grupo: "Pectorales", series: "12-10-8-6" },
        { nombre: "Apertura en máquina", grupo: "Pectorales", series: "4 x 12" },
        { nombre: "Cruce c/cables", grupo: "Pectorales", series: "4 x 15" },
        { nombre: "Fondos", grupo: "Pectorales", series: "4 x fallo" },
        { nombre: "Polea alta c/soga", grupo: "Tríceps", series: "15-12-10-drop set" },
        { nombre: "Press Francés c/barra", grupo: "Tríceps", series: "4 x 12" },
        { nombre: "Copa c/manc.", grupo: "Tríceps", series: "4 x 10" },
        { nombre: "Polea alta c/triángulo", grupo: "Tríceps", series: "12-10-8-rest pause" },
      ],
    },
    {
      nombre: "Espalda + Bíceps",
      tag: "DÍA 2",
      ejercicios: [
        { nombre: "Dominadas", grupo: "Espalda", series: "4 x fallo" },
        { nombre: "Jalón abierto al pecho", grupo: "Espalda", series: "4 x 12" },
        { nombre: "Remo c/barra prono", grupo: "Espalda", series: "12-10-8-6" },
        { nombre: "Remo en polea cerrado", grupo: "Espalda", series: "4 x 10" },
        { nombre: "Pull over c/soga", grupo: "Espalda", series: "4 x 15" },
        { nombre: "Curl c/barra parado", grupo: "Bíceps", series: "15-12-10-drop set" },
        { nombre: "Martillo c/manc. parado", grupo: "Bíceps", series: "4 x 10" },
        { nombre: "Curl en banco inclinado", grupo: "Bíceps", series: "12-10-8-6" },
        { nombre: "Polea baja c/barra", grupo: "Bíceps", series: "4 x 12" },
      ],
    },
    {
      nombre: "Cuádriceps + Glúteos",
      tag: "DÍA 3",
      ejercicios: [
        { nombre: "Sentadilla libre", grupo: "Cuádriceps", series: "12-10-8-6" },
        { nombre: "Prensa", grupo: "Cuádriceps", series: "4 x 15" },
        { nombre: "Sentadilla Hack 45", grupo: "Cuádriceps", series: "4 x 12" },
        { nombre: "Sillón de cuádriceps", grupo: "Cuádriceps", series: "15-12-10-drop set" },
        { nombre: "Hip thrust", grupo: "Glúteos", series: "4 x 10" },
        { nombre: "Sentadilla Búlgara", grupo: "Glúteos", series: "12-10-8-6" },
        { nombre: "Patada en máquina", grupo: "Glúteos", series: "4 x 15" },
        { nombre: "Abducción en máquina", grupo: "Glúteos", series: "4 x 20" },
      ],
    },
    {
      nombre: "Hombros + Trapecios",
      tag: "DÍA 4",
      ejercicios: [
        { nombre: "Press Militar c/manc.", grupo: "Hombros", series: "12-10-8-6" },
        { nombre: "Vuelo lateral c/manc.", grupo: "Hombros", series: "4 x 15" },
        { nombre: "Vuelo frontal c/barra", grupo: "Hombros", series: "4 x 12" },
        { nombre: "Posterior en máquina", grupo: "Hombros", series: "4 x 15" },
        { nombre: "Vuelo de pájaro c/manc.", grupo: "Hombros", series: "15-12-10-rest pause" },
        { nombre: "Encogimiento c/barra", grupo: "Trapecios", series: "4 x 12" },
        { nombre: "Encogimiento c/manc.", grupo: "Trapecios", series: "4 x 15" },
        { nombre: "Remo al mentón c/barra", grupo: "Trapecios", series: "12-10-8-6" },
      ],
    },
    {
      nombre: "Femorales + Pantorrillas + Core",
      tag: "DÍA 5",
      ejercicios: [
        { nombre: "Peso muerto c/barra", grupo: "Femorales", series: "12-10-8-6" },
        { nombre: "Camilla", grupo: "Femorales", series: "4 x 12" },
        { nombre: "Buenos Días c/barra", grupo: "Femorales", series: "4 x 10" },
        { nombre: "Sillón femoral", grupo: "Femorales", series: "15-12-10-drop set" },
        { nombre: "Pantorrilla en máquina", grupo: "Pantorrillas", series: "4 x 20" },
        { nombre: "Pantorrilla sentada", grupo: "Pantorrillas", series: "4 x 15" },
        { nombre: "Crunch c/soga", grupo: "Zona media", series: "4 x 20" },
        { nombre: "Plancha", grupo: "Zona media", series: "4 x 30s" },
        { nombre: "Elevación de piernas", grupo: "Zona media", series: "4 x 15" },
      ],
    },
  ],
};

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

export default function TVRutinas() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const clock = useClock();

  const rutina = RUTINA_MOCK;
  const totalDays = rutina.dias.length;
  const diaActual = rutina.dias[activeDayIndex];

  const goToDay = useCallback((index: number) => {
    setActiveDayIndex(index);
    setProgressKey((k) => k + 1); // reset progress bar
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveDayIndex((prev) => (prev + 1) % totalDays);
      setProgressKey((k) => k + 1);
    }, ROTATE_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [isPaused, totalDays]);

  // Keyboard
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToDay((activeDayIndex + 1) % totalDays);
      } else if (e.key === "ArrowLeft") {
        goToDay((activeDayIndex - 1 + totalDays) % totalDays);
      } else if (e.key === "p" || e.key === "P") {
        setIsPaused((prev) => !prev);
      } else if (e.key >= "1" && e.key <= "5") {
        goToDay(parseInt(e.key) - 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeDayIndex, totalDays, goToDay]);

  // Group exercises
  const grouped: Record<string, typeof diaActual.ejercicios> = {};
  diaActual.ejercicios.forEach((ej) => {
    if (!grouped[ej.grupo]) grouped[ej.grupo] = [];
    grouped[ej.grupo].push(ej);
  });
  const groupEntries = Object.entries(grouped);

  const formattedTime = clock
    ? clock.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
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
        <div className="flex items-end justify-between mb-3 shrink-0">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-[#ffd700] font-bold uppercase tracking-[0.3em]">
              {diaActual.tag}
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">
              {diaActual.nombre}
            </h2>
          </div>
          <span className="text-white/20 font-mono text-xs">
            {diaActual.ejercicios.length} ejercicios
          </span>
        </div>

        {/* Exercises — 2 column grid grouped by muscle */}
        <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-2 content-start overflow-hidden">
          {groupEntries.map(([grupo, ejercicios]) => (
            <div key={grupo}>
              {/* Group label */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#ffd700] font-heading text-[0.6875rem] font-bold uppercase tracking-[0.35em]">
                  {grupo}
                </span>
                <div className="flex-1 h-px bg-[rgba(255,215,0,0.12)]" />
              </div>

              {/* Exercises */}
              {ejercicios.map((ej, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 px-3 rounded-md odd:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[#ffd700]/25 font-mono text-xs font-bold w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg lg:text-xl font-medium truncate">
                      {ej.nombre}
                    </span>
                  </div>
                  <span className="font-mono text-base lg:text-lg text-[#ffd700] font-bold shrink-0 ml-4 tabular-nums">
                    {ej.series}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* ===== BANNER + QR ===== */}
      <div className="shrink-0 h-[5rem] bg-[#0a0a0a] border-t border-white/[0.06] flex items-center overflow-hidden">
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
