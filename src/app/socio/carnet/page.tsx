"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { ArrowRight } from "@/components/icons/GymIcons";
import { TarjetaVirtual } from "@/components/socio/TarjetaVirtual";
import type { EstadoCuenta } from "@/types/socio";

export default function CarnetPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const [estado, setEstado] = useState<EstadoCuenta | null>(null);

  useEffect(() => {
    if (status === "guest") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<EstadoCuenta>("/api/socio/estado-cuenta");
        if (!cancelled) setEstado(data);
      } catch {
        /* noop — la tarjeta igual se muestra con estado sin_membresia fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status !== "authenticated" || !user) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gym-text-tertiary">
          Cargando…
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gym-bg flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 md:px-12 py-8 md:py-12">
        <Link
          href="/socio"
          className="inline-flex items-center gap-2 px-5 py-3 border border-gym-border-strong text-gym-chalk text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Volver al panel
        </Link>

        <div className="text-center mb-8">
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary mb-2">
            Mostrá esta tarjeta al recepcionista
          </p>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-gym-chalk">
            Tu <span className="text-gym-gold">carnet.</span>
          </h1>
        </div>

        <div className="flex justify-center">
          <TarjetaVirtual
            codigoSocio={user.codigo_socio}
            nombreCompleto={user.nombre_completo}
            plan={estado?.plan ?? null}
            venceEl={estado?.vence_el ?? null}
            estado={estado?.estado ?? "sin_membresia"}
            size="large"
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gym-text-tertiary leading-relaxed max-w-sm mx-auto">
            Subí el brillo de la pantalla al máximo si hay luz fuerte en el mostrador.
          </p>
        </div>
      </div>
    </main>
  );
}
