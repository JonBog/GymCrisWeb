"use client";

import Image from "next/image";
import type { EstadoMembresia } from "@/types/socio";

type PlanInfo = {
  Nombre: string;
  periodo: string | null;
  CantidadPeriodo: number;
} | null;

type Props = {
  codigoSocio: string;
  nombreCompleto: string;
  plan: PlanInfo;
  venceEl: string | null;
  estado: EstadoMembresia;
  size?: "normal" | "large";
};

type Tier = "premium" | "mid" | "basic";

function getTier(plan: PlanInfo, estado: EstadoMembresia): Tier {
  if (estado === "sin_membresia" || !plan) return "basic";
  if (estado === "vencido") return "basic";
  const periodo = plan.periodo?.toLowerCase();
  if (periodo === "mes" || periodo === "año" || periodo === "ano") return "premium";
  if (periodo === "semana") return "mid";
  return "basic";
}

function formatFechaLarga(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

const tierStyles: Record<Tier, {
  wrapper: string;
  inner: string;
  planLabel: string;
  chip: string;
  shimmer: string;
  codeHighlight: string;
}> = {
  premium: {
    wrapper: "bg-gradient-to-br from-[#ffd700] via-[#e6b800] to-[#8a6b00] text-gym-bg",
    inner: "border border-[#fff5ba]/40",
    planLabel: "text-gym-bg/90",
    chip: "bg-gym-bg text-gym-gold border border-gym-bg/50",
    shimmer: "bg-gradient-to-tr from-transparent via-white/20 to-transparent",
    codeHighlight: "text-gym-bg/95",
  },
  mid: {
    wrapper: "bg-gradient-to-br from-[#2a2520] via-[#1a1612] to-[#0a0a0a] text-gym-chalk",
    inner: "border border-gym-gold/25",
    planLabel: "text-gym-gold",
    chip: "bg-gym-gold/15 text-gym-gold border border-gym-gold/40",
    shimmer: "bg-gradient-to-tr from-transparent via-gym-gold/10 to-transparent",
    codeHighlight: "text-gym-gold",
  },
  basic: {
    wrapper: "bg-gradient-to-br from-[#1f1d1b] via-[#14120f] to-[#0a0a0a] text-gym-chalk",
    inner: "border border-gym-border-strong",
    planLabel: "text-gym-text-tertiary",
    chip: "bg-gym-surface-2 text-gym-text-secondary border border-gym-border",
    shimmer: "bg-gradient-to-tr from-transparent via-white/5 to-transparent",
    codeHighlight: "text-gym-chalk",
  },
};

export function TarjetaVirtual({
  codigoSocio,
  nombreCompleto,
  plan,
  venceEl,
  estado,
  size = "normal",
}: Props) {
  const tier = getTier(plan, estado);
  const styles = tierStyles[tier];
  const planLabel =
    estado === "sin_membresia" || !plan
      ? "Sin membresía"
      : estado === "vencido"
        ? `${plan.Nombre} (Vencido)`
        : plan.Nombre;

  const sizeClasses =
    size === "large"
      ? "max-w-xl aspect-[1.586/1]"
      : "max-w-md aspect-[1.586/1]";

  return (
    <div className={`relative ${sizeClasses} w-full ${styles.wrapper} shadow-2xl overflow-hidden`}>
      {/* Shimmer overlay */}
      <div className={`absolute inset-0 pointer-events-none ${styles.shimmer}`} />
      {/* Grid pattern overlay (sutil) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)",
        }}
      />

      <div className={`relative h-full ${styles.inner} p-6 md:p-8 flex flex-col justify-between`}>
        {/* Top row: logo + plan */}
        <div className="flex items-start justify-between">
          <Image
            src="/icons/icon-512.png"
            alt="GymCris"
            width={80}
            height={80}
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <span
            className={`inline-flex items-center px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${styles.chip}`}
          >
            {planLabel}
          </span>
        </div>

        {/* Chip (detail decorativo) */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-7 rounded-sm ${
              tier === "premium"
                ? "bg-gym-bg/30 border border-gym-bg/40"
                : "bg-gym-gold/30 border border-gym-gold/40"
            }`}
          />
          <div
            className={`h-5 w-px ${tier === "premium" ? "bg-gym-bg/20" : "bg-gym-border"}`}
          />
          <span
            className={`font-mono text-[9px] tracking-[0.3em] uppercase ${
              tier === "premium" ? "text-gym-bg/70" : "text-gym-text-tertiary"
            }`}
          >
            Socio
          </span>
        </div>

        {/* Bottom: nombre + codigo + vence */}
        <div className="space-y-3">
          <p className="font-heading text-xl md:text-2xl uppercase tracking-tight leading-none">
            {nombreCompleto}
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className={`font-mono text-[9px] tracking-[0.3em] uppercase ${
                  tier === "premium" ? "text-gym-bg/60" : "text-gym-text-tertiary"
                }`}
              >
                N° de socio
              </p>
              <p className={`font-mono text-lg md:text-xl tracking-[0.2em] font-bold ${styles.codeHighlight}`}>
                {codigoSocio}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-mono text-[9px] tracking-[0.3em] uppercase ${
                  tier === "premium" ? "text-gym-bg/60" : "text-gym-text-tertiary"
                }`}
              >
                Vence
              </p>
              <p className="font-mono text-sm md:text-base tracking-wider font-bold">
                {formatFechaLarga(venceEl)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
