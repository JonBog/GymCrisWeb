"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { descripcionDelDia, formatFechaCorta, formatMoneda } from "@/lib/format";
import {
  ArrowRight,
  Dumbbell,
  HeartPulse,
  Lock,
} from "@/components/icons/GymIcons";
import { TarjetaVirtual } from "@/components/socio/TarjetaVirtual";
import { SemaforoEstado } from "@/components/socio/SemaforoEstado";
import type { EstadoCuenta, PagosResponse, Rutina } from "@/types/socio";

export default function SocioPage() {
  const router = useRouter();
  const { user, status, logout } = useAuth();

  const [estado, setEstado] = useState<EstadoCuenta | null>(null);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [ultimosPagos, setUltimosPagos] = useState<PagosResponse | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "guest") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    (async () => {
      try {
        const [estadoRes, rutinaRes, pagosRes] = await Promise.all([
          apiFetch<EstadoCuenta>("/api/socio/estado-cuenta"),
          apiFetch<{ rutina: Rutina | null }>("/api/socio/rutina-vigente"),
          apiFetch<PagosResponse>("/api/socio/pagos?page=1"),
        ]);
        if (cancelled) return;
        setEstado(estadoRes);
        setRutina(rutinaRes.rutina);
        setUltimosPagos(pagosRes);
      } catch {
        if (!cancelled) setDataError("No pudimos cargar tus datos. Probá recargar.");
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

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const primerNombre = user.Nombre;
  const nombreTarjeta = user.nombre_completo;
  const ultimosTres = ultimosPagos?.data.slice(0, 3) ?? [];

  return (
    <main className="flex-1 bg-gym-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Header */}
        <div className="flex items-center justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-4 h-4 text-gym-gold" />
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary">
                Área de Socios
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight text-gym-chalk">
              Hola, <span className="text-gym-gold">{primerNombre}.</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hidden md:inline-flex items-center gap-2 border border-gym-border-strong text-gym-chalk px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {dataError && (
          <div className="mb-8 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {dataError}
          </div>
        )}

        {/* Hero: Tarjeta virtual + acciones rápidas */}
        <section className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start mb-12 md:mb-16">
          <div className="w-full flex justify-center lg:justify-start">
            <TarjetaVirtual
              codigoSocio={user.codigo_socio}
              nombreCompleto={nombreTarjeta}
              plan={estado?.plan ?? null}
              venceEl={estado?.vence_el ?? null}
              estado={estado?.estado ?? "sin_membresia"}
              size="large"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/socio/carnet"
              className="group flex items-center justify-between gap-4 bg-gym-gold text-gym-gold-text px-6 py-5 font-black text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors"
            >
              <span>Mostrar tarjeta en pantalla</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="border border-gym-border-strong bg-gym-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <HeartPulse className="w-4 h-4 text-gym-gold" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gym-text-tertiary">
                  Estado de cuenta
                </span>
              </div>
              {estado ? (
                <SemaforoEstado
                  estado={estado.estado}
                  diasRestantes={estado.dias_restantes}
                  conDeuda={estado.con_deuda}
                />
              ) : (
                <p className="text-sm text-gym-text-tertiary">Cargando…</p>
              )}
              {estado?.vence_el && (
                <p className="mt-4 text-xs font-mono uppercase tracking-wider text-gym-text-tertiary">
                  Vence el {formatFechaCorta(estado.vence_el)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sections: Rutina + Pagos */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Rutina */}
          <Link
            href="/socio/rutina"
            className="group border border-gym-border-strong bg-gym-surface p-6 md:p-8 hover:border-gym-gold transition-colors flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-4 h-4 text-gym-gold" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gym-text-tertiary">
                  Rutina vigente
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gym-text-tertiary group-hover:text-gym-gold group-hover:translate-x-1 transition-all" />
            </div>
            {rutina ? (
              <>
                <p className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gym-chalk leading-tight mb-2">
                  {rutina.Nombre}
                </p>
                <p className="text-xs font-mono tracking-[0.15em] uppercase text-gym-text-tertiary mb-6">
                  {rutina.Tipo} · {rutina.dias.length}{" "}
                  {rutina.dias.length === 1 ? "día" : "días"}
                </p>
                <ul className="mt-auto space-y-2 pt-4 border-t border-gym-border">
                  {rutina.dias.slice(0, 3).map((dia) => (
                    <li
                      key={dia.id}
                      className="flex items-center gap-3 text-sm text-gym-text-secondary"
                    >
                      <span className="font-mono text-[10px] text-gym-gold tracking-[0.2em] w-6">
                        D{dia.Orden}
                      </span>
                      <span className="truncate">{descripcionDelDia(dia.Nombre)}</span>
                    </li>
                  ))}
                  {rutina.dias.length > 3 && (
                    <li className="text-xs font-mono uppercase tracking-wider text-gym-text-tertiary pt-1">
                      + {rutina.dias.length - 3} días más →
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gym-text-secondary leading-relaxed">
                Por ahora no hay rutina vigente. Consultá con Cris o mirá la TV del salón.
              </p>
            )}
          </Link>

          {/* Pagos recientes */}
          <Link
            href="/socio/pagos"
            className="group border border-gym-border-strong bg-gym-surface p-6 md:p-8 hover:border-gym-gold transition-colors flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gym-gold" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gym-text-tertiary">
                  Historial de pagos
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gym-text-tertiary group-hover:text-gym-gold group-hover:translate-x-1 transition-all" />
            </div>

            {ultimosTres.length === 0 ? (
              <p className="text-sm text-gym-text-secondary">Aún no tenés pagos registrados.</p>
            ) : (
              <>
                <p className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gym-chalk leading-tight mb-2">
                  {ultimosPagos?.total ?? 0} pagos
                </p>
                <p className="text-xs font-mono tracking-[0.15em] uppercase text-gym-text-tertiary mb-6">
                  Último: {formatFechaCorta(ultimosTres[0].Fecha)}
                </p>
                <ul className="mt-auto space-y-3 pt-4 border-t border-gym-border">
                  {ultimosTres.map((pago) => {
                    const tipo = pago.formas_pago[0]?.tipo?.Abreviatura ?? "—";
                    return (
                      <li
                        key={pago.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-[10px] text-gym-text-tertiary tracking-[0.15em] uppercase w-12 shrink-0">
                            {formatFechaCorta(pago.Fecha)}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gym-gold px-2 py-0.5 border border-gym-gold/30">
                            {tipo}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-gym-chalk font-bold">
                          {formatMoneda(pago.Monto)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Link>
        </section>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gym-border-strong text-gym-chalk px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-gym-surface-2 transition-colors"
          >
            Volver al sitio
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="md:hidden inline-flex items-center justify-center gap-2 bg-gym-gold text-gym-gold-text px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
