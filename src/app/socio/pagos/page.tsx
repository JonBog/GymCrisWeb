"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { formatFechaLarga, formatFechaMedia, formatMoneda } from "@/lib/format";
import { ArrowRight, Clipboard } from "@/components/icons/GymIcons";
import type { PagosResponse } from "@/types/socio";

export default function PagosPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [page, setPage] = useState(1);
  const [pagos, setPagos] = useState<PagosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "guest") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await apiFetch<PagosResponse>(`/api/socio/pagos?page=${page}`);
        if (!cancelled) setPagos(data);
      } catch {
        if (!cancelled) setError("No pudimos cargar tus pagos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, page]);

  if (status !== "authenticated") {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gym-text-tertiary">
          Cargando…
        </div>
      </main>
    );
  }

  const totalPaginas = pagos?.last_page ?? 1;

  return (
    <main className="flex-1 bg-gym-bg">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <Link
          href="/socio"
          className="inline-flex items-center gap-2 px-5 py-3 border border-gym-border-strong text-gym-chalk text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Volver al panel
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Clipboard className="w-4 h-4 text-gym-gold" />
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary">
            Historial de pagos
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-3">
          Tus <span className="text-gym-gold">pagos.</span>
        </h1>
        {pagos && (
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-gym-text-tertiary mb-10">
            {pagos.total} {pagos.total === 1 ? "pago" : "pagos"} en total
          </p>
        )}

        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="border border-gym-border-strong bg-gym-surface">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gym-border-strong font-mono text-[10px] tracking-[0.25em] uppercase text-gym-text-tertiary">
            <span>Fecha</span>
            <span>Forma de pago</span>
            <span>Detalle</span>
            <span className="text-right">Monto</span>
          </div>

          {/* Rows */}
          {loading ? (
            <p className="px-6 py-8 text-sm text-gym-text-tertiary">Cargando…</p>
          ) : pagos && pagos.data.length > 0 ? (
            <ul className="divide-y divide-gym-border">
              {pagos.data.map((pago) => {
                const tipoPrincipal = pago.formas_pago[0]?.tipo;
                const tipos = pago.formas_pago
                  .map((fp) => fp.tipo?.Nombre)
                  .filter(Boolean)
                  .join(" + ");
                return (
                  <li key={pago.id} className="px-4 py-4 md:px-6">
                    {/* Mobile: fila única — fecha+badge a la izquierda, monto a la derecha */}
                    <div className="flex items-start justify-between gap-3 md:hidden">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm text-gym-chalk tracking-wider">
                          {formatFechaMedia(pago.Fecha)}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gym-gold px-2 py-0.5 border border-gym-gold/30 shrink-0">
                            {tipoPrincipal?.Abreviatura ?? "—"}
                          </span>
                          {pago.formas_pago.length > 1 && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gym-text-tertiary truncate">
                              + {pago.formas_pago.length - 1}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-mono text-base text-gym-chalk font-bold text-right shrink-0 whitespace-nowrap">
                        {formatMoneda(pago.Monto)}
                      </p>
                    </div>

                    {/* Desktop: grid de 4 columnas */}
                    <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-4 md:items-center">
                      <p className="font-mono text-sm text-gym-chalk tracking-wider">
                        {formatFechaLarga(pago.Fecha)}
                      </p>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gym-gold px-2 py-0.5 border border-gym-gold/30 inline-block">
                          {tipoPrincipal?.Abreviatura ?? "—"}
                        </span>
                      </div>
                      <p className="text-xs text-gym-text-secondary truncate">
                        {tipos || "—"}
                      </p>
                      <p className="font-mono text-base text-gym-chalk font-bold text-right">
                        {formatMoneda(pago.Monto)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-6 py-8 text-sm text-gym-text-secondary">
              Aún no hay pagos registrados.
            </p>
          )}
        </div>

        {/* Pagination */}
        {pagos && totalPaginas > 1 && (
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-2 border border-gym-border-strong text-gym-chalk px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Anterior
            </button>

            <span className="font-mono text-xs tracking-[0.2em] uppercase text-gym-text-secondary whitespace-nowrap">
              {pagos.current_page} / {pagos.last_page}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
              disabled={page >= totalPaginas || loading}
              className="inline-flex items-center gap-2 border border-gym-border-strong text-gym-chalk px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
