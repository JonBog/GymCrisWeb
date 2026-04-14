"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginTeaserModal } from "@/components/LoginTeaserModal";
import {
  IWFPlate,
  User,
  ArrowRight,
  Lock,
} from "@/components/icons/GymIcons";
import { RUTINA_VIGENTE } from "@/data/rutinas";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
}

export default function RutinasPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const rutina = RUTINA_VIGENTE;

  return (
    <>
      {/* ===== TOP BAR (minimal) ===== */}
      <header className="fixed top-0 w-full z-50 bg-gym-bg/90 backdrop-blur-md border-b border-gym-border">
        <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-6 py-4 md:py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-heading tracking-tight text-gym-gold uppercase"
          >
            <IWFPlate className="w-5 h-5 md:w-6 md:h-6" />
            GymCris
          </Link>
          <div className="flex items-center gap-5 md:gap-6">
            <Link
              href="/"
              className="hidden sm:inline text-gym-text-tertiary hover:text-gym-gold transition-colors uppercase text-[10px] tracking-[0.3em] font-bold"
            >
              ← Volver
            </Link>
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 bg-gym-gold text-gym-gold-text font-black px-5 md:px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] hover:bg-gym-tungsten transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Ingresar</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-24 md:pt-28">
        {/* ===== HERO ===== */}
        <section className="w-full bg-gym-bg border-b border-gym-border relative overflow-hidden grain">
          <div
            aria-hidden
            className="absolute -left-20 -top-10 font-heading text-[14rem] md:text-[22rem] text-gym-chalk/[0.02] select-none leading-none pointer-events-none"
          >
            {rutina.dias.length}
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gym-gold" />
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-gym-gold">
                Rutina del ciclo · vigente
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-6">
              {rutina.nombre.split("—")[0].trim()}
              <br />
              <span className="text-gym-gold">
                {rutina.nombre.split("—")[1]?.trim() ?? ""}
              </span>
            </h1>
            <p className="text-gym-text-secondary text-base md:text-xl font-light leading-relaxed max-w-2xl mb-8">
              Del {formatFecha(rutina.desde)} al {formatFecha(rutina.hasta)}. {rutina.dias.length} días de gym, rotamos cada 15. La misma rutina para
              todos los socios — el ciclo que Cris tiene activo en el piso.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-gym-border-strong">
              <Lock className="w-3.5 h-3.5 text-gym-gold" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gym-text-secondary">
                Series y formatos — solo socios
              </span>
            </div>
          </div>
        </section>

        {/* ===== DÍAS ===== */}
        <section className="w-full bg-gym-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="space-y-6 md:space-y-8">
              {rutina.dias.map((dia) => (
                <article
                  key={dia.orden}
                  className="bg-gym-bg border border-gym-border"
                >
                  {/* Card header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-6 md:px-10 py-6 md:py-8 border-b border-gym-border">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-gold">
                          Día {dia.orden.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <h2 className="font-heading text-3xl md:text-4xl uppercase leading-tight tracking-tight text-gym-chalk">
                        {dia.grupos.join(" + ")}
                      </h2>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gym-text-tertiary">
                      {dia.ejercicios.length} ejercicios
                    </div>
                  </div>

                  {/* Exercise list */}
                  <ol className="divide-y divide-gym-border">
                    {dia.ejercicios.map((ej) => (
                      <li
                        key={ej.orden}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 px-6 md:px-10 py-4"
                      >
                        <span className="font-mono text-[11px] md:text-xs text-gym-text-muted tabular-nums">
                          {ej.orden.toString().padStart(2, "0")}
                        </span>
                        <span className="text-sm md:text-base text-gym-chalk font-medium">
                          {ej.nombre}
                        </span>
                        {/* Gated series — redacted bar */}
                        <span
                          aria-label="Series y formato (bloqueado)"
                          className="flex items-center gap-2"
                        >
                          <span className="hidden sm:inline-block w-20 md:w-28 h-2.5 bg-gym-surface-3 relative overflow-hidden">
                            <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,215,0,0.08)_0_6px,transparent_6px_12px)]" />
                          </span>
                          <Lock className="w-3.5 h-3.5 text-gym-text-muted" />
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA GATE ===== */}
        <section className="w-full bg-gym-bg border-y border-gym-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-gym-gold" />
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-gym-gold">
                  Para socios
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-6">
                Las series, los métodos
                <br />
                <span className="text-gym-gold">y las notas de Cris.</span>
              </h2>
              <p className="text-gym-text-secondary text-base md:text-lg font-light leading-relaxed mb-10">
                Los ejercicios los ves acá. Las series, el formato (piramidal,
                drop set, rest pause) y las notas con las que Cris te corrige
                la técnica, eso es para socios. Pronto vas a poder verlo desde
                el área de miembros.
              </p>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="group inline-flex items-center gap-3 bg-gym-gold text-gym-gold-text px-7 md:px-9 py-4 md:py-5 font-black text-xs md:text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
                <span>Ingresar al área de socios</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-6 text-xs text-gym-text-tertiary">
                ¿Todavía no sos socio?{" "}
                <Link
                  href="/#precios"
                  className="text-gym-gold hover:underline"
                >
                  Mirá los planes
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER (minimal) ===== */}
      <footer className="w-full bg-gym-bg border-t border-gym-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gym-text-muted">
          <Link
            href="/"
            className="flex items-center gap-2 text-gym-text-tertiary hover:text-gym-gold transition-colors"
          >
            <IWFPlate className="w-4 h-4" />
            Volver al inicio
          </Link>
          <span>Gimnasio Cris · Río de la Plata 7462</span>
        </div>
      </footer>

      <LoginTeaserModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}
