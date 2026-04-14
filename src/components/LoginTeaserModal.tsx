"use client";

import { useEffect, useRef } from "react";
import { Close, Lock, User, IWFPlate, Clipboard, HeartPulse } from "./icons/GymIcons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LoginTeaserModal({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-teaser-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-gym-bg/90 backdrop-blur-md cursor-default"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-gym-surface border border-gym-border-strong grain">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gym-border">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gym-gold" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary">
              Área de Miembros
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gym-text-tertiary hover:text-gym-chalk transition-colors p-1"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 md:px-10 py-10 md:py-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gym-border-strong mb-8">
            <span className="w-1.5 h-1.5 bg-gym-gold animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gym-gold">
              Próximamente
            </span>
          </div>

          <h2
            id="login-teaser-title"
            className="font-heading text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-6"
          >
            Tu carnet
            <br />
            <span className="text-gym-gold">en el bolsillo.</span>
          </h2>

          <p className="text-gym-text-secondary text-base md:text-lg font-light leading-relaxed max-w-md mb-10">
            Estamos preparando el área de socios. Pronto vas a poder ingresar
            con tu cuenta para ver tu membresía, tu carnet virtual y tu rutina
            del mes, todo desde el celular.
          </p>

          {/* Feature list — blueprint icons, no containers */}
          <ul className="space-y-5 mb-10">
            <li className="flex items-start gap-4">
              <User className="w-5 h-5 text-gym-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gym-chalk">
                  Estado de membresía
                </p>
                <p className="text-xs text-gym-text-tertiary mt-0.5">
                  Vencimiento, plan activo, pagos al día.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <IWFPlate className="w-5 h-5 text-gym-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gym-chalk">
                  Carnet virtual
                </p>
                <p className="text-xs text-gym-text-tertiary mt-0.5">
                  Código QR para entrar al gym sin tarjeta física.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Clipboard className="w-5 h-5 text-gym-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gym-chalk">
                  Rutina personal
                </p>
                <p className="text-xs text-gym-text-tertiary mt-0.5">
                  La que Cris te arma, siempre disponible.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <HeartPulse className="w-5 h-5 text-gym-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gym-chalk">
                  Historial de entrenos
                </p>
                <p className="text-xs text-gym-text-tertiary mt-0.5">
                  Tu progreso sin perder una sola sesión.
                </p>
              </div>
            </li>
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.instagram.com/gimnasiocris1997/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gym-gold text-gym-gold-text px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors"
            >
              Avisame cuando esté listo
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-center border border-gym-border-strong text-gym-chalk px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-gym-surface-2 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
