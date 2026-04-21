"use client";

import type { EstadoMembresia } from "@/types/socio";

type Props = {
  estado: EstadoMembresia;
  diasRestantes: number | null;
  conDeuda: boolean;
};

const config: Record<EstadoMembresia, { dot: string; label: string; text: string }> = {
  al_dia: {
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    label: "Al día",
    text: "text-emerald-300",
  },
  por_vencer: {
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
    label: "Por vencer",
    text: "text-amber-300",
  },
  vencido: {
    dot: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]",
    label: "Vencido",
    text: "text-red-300",
  },
  sin_membresia: {
    dot: "bg-gym-text-tertiary",
    label: "Sin membresía",
    text: "text-gym-text-tertiary",
  },
};

export function SemaforoEstado({ estado, diasRestantes, conDeuda }: Props) {
  const cfg = config[estado];

  const subtitle =
    estado === "al_dia"
      ? diasRestantes !== null
        ? `${diasRestantes} ${diasRestantes === 1 ? "día restante" : "días restantes"}`
        : "Membresía activa"
      : estado === "por_vencer"
        ? diasRestantes !== null
          ? `Vence en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`
          : "Próximo a vencer"
        : estado === "vencido"
          ? diasRestantes !== null
            ? `Vencida hace ${Math.abs(diasRestantes)} ${Math.abs(diasRestantes) === 1 ? "día" : "días"}`
            : "Membresía vencida"
          : "Sumate a un plan";

  return (
    <div className="flex items-start gap-3">
      <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 ${cfg.dot} animate-pulse`} />
      <div>
        <p className={`font-heading text-xl uppercase tracking-tight ${cfg.text}`}>{cfg.label}</p>
        <p className="text-xs text-gym-text-secondary mt-0.5">{subtitle}</p>
        {conDeuda && (
          <p className="text-[11px] text-amber-300 mt-1 font-mono uppercase tracking-wider">
            · Con deuda pendiente
          </p>
        )}
      </div>
    </div>
  );
}
