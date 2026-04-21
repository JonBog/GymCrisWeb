"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { descripcionDelDia, formatFechaCorta } from "@/lib/format";
import { ArrowRight, Dumbbell, Play } from "@/components/icons/GymIcons";
import { VideoModal } from "@/components/VideoModal";
import type { Rutina } from "@/types/socio";

type RutinaState =
  | { status: "loading" }
  | { status: "success"; rutina: Rutina | null }
  | { status: "error"; message: string };

const STORAGE_KEY = "gymcris:rutina:selected";

type StoredSelection = {
  rutinaId: number;
  diaIndex: number;
};

function readStoredSelection(): StoredSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.rutinaId === "number" &&
      typeof parsed.diaIndex === "number"
    ) {
      return parsed;
    }
  } catch {
    /* noop */
  }
  return null;
}

function writeStoredSelection(rutinaId: number, diaIndex: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rutinaId, diaIndex } satisfies StoredSelection),
    );
  } catch {
    /* noop */
  }
}


type VideoState = { url: string; title: string } | null;

export default function RutinaPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [rutinaState, setRutinaState] = useState<RutinaState>({ status: "loading" });
  const [selectedDiaIndex, setSelectedDiaIndex] = useState(0);
  const [videoState, setVideoState] = useState<VideoState>(null);

  useEffect(() => {
    if (status === "guest") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      setRutinaState({ status: "loading" });
      try {
        const data = await apiFetch<{ rutina: Rutina | null }>("/api/socio/rutina-vigente");
        if (!cancelled) setRutinaState({ status: "success", rutina: data.rutina });
      } catch {
        if (!cancelled)
          setRutinaState({ status: "error", message: "No pudimos cargar la rutina." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  // Restore selection from localStorage when rutina loads
  const rutina = rutinaState.status === "success" ? rutinaState.rutina : null;
  const rutinaId = rutina?.id ?? null;
  const totalDias = rutina?.dias.length ?? 0;

  useEffect(() => {
    if (!rutinaId || totalDias === 0) return;
    const stored = readStoredSelection();
    if (stored && stored.rutinaId === rutinaId && stored.diaIndex < totalDias) {
      setSelectedDiaIndex(stored.diaIndex);
    } else {
      setSelectedDiaIndex(0);
    }
  }, [rutinaId, totalDias]);

  const handleSelectDia = (index: number) => {
    setSelectedDiaIndex(index);
    if (rutinaId !== null) {
      writeStoredSelection(rutinaId, index);
    }
  };

  const diaActual = useMemo(
    () => rutina?.dias[selectedDiaIndex] ?? null,
    [rutina, selectedDiaIndex],
  );

  if (status !== "authenticated") {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-gym-text-tertiary">
          Cargando…
        </div>
      </main>
    );
  }

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
          <Dumbbell className="w-4 h-4 text-gym-gold" />
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary">
            Rutina vigente
          </span>
        </div>

        {rutinaState.status === "loading" && (
          <p className="text-sm text-gym-text-tertiary">Cargando tu rutina…</p>
        )}
        {rutinaState.status === "error" && (
          <p className="text-sm text-red-400">{rutinaState.message}</p>
        )}
        {rutinaState.status === "success" && !rutinaState.rutina && (
          <div className="border border-gym-border-strong bg-gym-surface p-8">
            <p className="text-gym-text-secondary">
              Por ahora no hay rutina vigente. Consultá con Cris o mirá la TV del salón.
            </p>
          </div>
        )}

        {rutina && (
          <>
            <h1 className="font-heading text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-4">
              {rutina.Nombre}
            </h1>
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-gym-text-tertiary mb-6">
              {rutina.Tipo} · {formatFechaCorta(rutina.FechaDesde)} →{" "}
              {formatFechaCorta(rutina.FechaHasta)} · {rutina.dias.length}{" "}
              {rutina.dias.length === 1 ? "día" : "días"}
            </p>
            {rutina.Notas && (
              <p className="text-sm italic text-gym-text-secondary leading-relaxed mb-8 max-w-3xl">
                {rutina.Notas}
              </p>
            )}

            {/* Tabs de días — tap targets grandes para mobile */}
            <div
              role="tablist"
              aria-label="Días de la rutina"
              className="mb-8 flex gap-2 overflow-x-auto overscroll-x-contain border-b border-gym-border-strong -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {rutina.dias.map((dia, index) => {
                const isActive = index === selectedDiaIndex;
                return (
                  <button
                    key={dia.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => handleSelectDia(index)}
                    className={`shrink-0 min-w-[120px] px-5 py-4 md:py-3 font-mono text-xs md:text-[11px] tracking-[0.2em] uppercase font-bold transition-colors border-b-2 -mb-[1px] ${
                      isActive
                        ? "text-gym-gold border-gym-gold bg-gym-gold/5"
                        : "text-gym-text-tertiary border-transparent hover:text-gym-chalk active:bg-gym-surface-2"
                    }`}
                  >
                    <span className="block text-left leading-tight">
                      <span className="block text-[10px] text-gym-text-tertiary">
                        Día {dia.Orden}
                      </span>
                      <span className={`block mt-1 ${isActive ? "text-gym-gold" : ""}`}>
                        {descripcionDelDia(dia.Nombre)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contenido del día seleccionado */}
            {diaActual && (
              <article className="border border-gym-border-strong bg-gym-surface p-6 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gym-gold">
                      Día {diaActual.Orden} de {rutina.dias.length}
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-gym-chalk mt-2 leading-tight">
                      {descripcionDelDia(diaActual.Nombre)}
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gym-text-tertiary whitespace-nowrap pt-2">
                    {diaActual.ejercicios.length} ejercicios
                  </span>
                </div>

                {diaActual.Notas && (
                  <p className="text-xs italic text-gym-text-secondary mb-6 leading-relaxed">
                    {diaActual.Notas}
                  </p>
                )}

                <ol className="divide-y divide-gym-border">
                  {diaActual.ejercicios.map((ej) => {
                    const meta = [
                      ej.ejercicio.grupo_muscular?.Nombre,
                      ej.ejercicio.tipo_equipamiento?.Nombre,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <li
                        key={ej.id}
                        className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span className="font-mono text-sm text-gym-text-tertiary pt-1 min-w-8 font-bold">
                          {String(ej.Orden).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-base uppercase tracking-wide text-gym-chalk">
                              {ej.ejercicio.Nombre}
                            </p>
                            {ej.ejercicio.UrlVideo && (
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoState({
                                    url: ej.ejercicio.UrlVideo!,
                                    title: ej.ejercicio.Nombre,
                                  })
                                }
                                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gym-border-strong text-gym-gold text-[10px] font-mono uppercase tracking-[0.15em] font-bold hover:bg-gym-gold/10 active:bg-gym-gold/10 transition-colors"
                                aria-label={`Ver video de ${ej.ejercicio.Nombre}`}
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Video</span>
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gym-gold font-mono tracking-wider mt-1">
                            {ej.serie_formato.Nombre}
                            {ej.serie_formato.metodo_entrenamiento && (
                              <span className="text-gym-text-tertiary">
                                {" · "}
                                {ej.serie_formato.metodo_entrenamiento.Nombre}
                              </span>
                            )}
                          </p>
                          {meta && (
                            <p className="text-[11px] text-gym-text-tertiary mt-1 uppercase tracking-wider">
                              {meta}
                            </p>
                          )}
                          {ej.Notas && (
                            <p className="text-xs text-gym-text-secondary italic mt-2 leading-relaxed">
                              {ej.Notas}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Nav entre días — botones táctiles */}
                <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-gym-border">
                  <button
                    type="button"
                    disabled={selectedDiaIndex === 0}
                    onClick={() => handleSelectDia(selectedDiaIndex - 1)}
                    className="inline-flex items-center gap-2 px-4 py-3 border border-gym-border-strong text-gym-chalk text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span className="hidden sm:inline">Día anterior</span>
                    <span className="sm:hidden">Anterior</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedDiaIndex >= rutina.dias.length - 1}
                    onClick={() => handleSelectDia(selectedDiaIndex + 1)}
                    className="inline-flex items-center gap-2 px-4 py-3 border border-gym-border-strong text-gym-chalk text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-gym-surface-2 active:bg-gym-surface-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <span className="hidden sm:inline">Día siguiente</span>
                    <span className="sm:hidden">Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            )}
          </>
        )}
      </div>

      <VideoModal
        open={videoState !== null}
        onClose={() => setVideoState(null)}
        url={videoState?.url ?? null}
        title={videoState?.title}
      />
    </main>
  );
}
