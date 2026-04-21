"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Close, Lock, User } from "./icons/GymIcons";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LoginModal({ open, onClose }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dniInputRef = useRef<HTMLInputElement>(null);

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dniInputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDni("");
      setPassword("");
      setErrorMessage(null);
      setFieldErrors({});
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      await login({ dni: dni.replace(/\D/g, ""), password });
      onClose();
      router.push("/socio");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        setFieldErrors(error.errors);
      } else {
        setErrorMessage("No pudimos conectar con el servidor. Probá de nuevo.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="fixed inset-0 bg-gym-bg/90 backdrop-blur-md cursor-default"
      />

      <div className="relative min-h-full flex items-start md:items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-md bg-gym-surface border border-gym-border-strong grain my-auto">
          <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gym-border">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gym-gold" />
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary">
                Área de Socios
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

          <div className="px-6 md:px-10 py-10 md:py-12">
            <h2
              id="login-title"
              className="font-heading text-3xl md:text-4xl uppercase leading-[0.9] tracking-tight text-gym-chalk mb-3"
            >
              Ingresá con
              <br />
              <span className="text-gym-gold">tu DNI.</span>
            </h2>

            <p className="text-gym-text-secondary text-sm font-light leading-relaxed mb-8">
              Tu DNI es tu usuario. Si es tu primera vez, pedile la contraseña a Cris en el gym.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="login-dni"
                  className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gym-text-tertiary mb-2"
                >
                  DNI
                </label>
                <div className="flex items-center gap-3 border border-gym-border-strong bg-gym-bg/50 focus-within:border-gym-gold transition-colors">
                  <span className="pl-3 text-gym-text-tertiary">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    ref={dniInputRef}
                    id="login-dni"
                    name="dni"
                    type="text"
                    inputMode="numeric"
                    autoComplete="username"
                    pattern="[0-9.]*"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    disabled={submitting}
                    className="flex-1 bg-transparent py-3 pr-3 text-gym-chalk placeholder:text-gym-text-tertiary focus:outline-none disabled:opacity-50 tracking-wider"
                    placeholder="12345678"
                  />
                </div>
                {fieldErrors.dni?.[0] && (
                  <p className="mt-2 text-xs text-red-400">{fieldErrors.dni[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block font-mono text-[10px] tracking-[0.25em] uppercase text-gym-text-tertiary mb-2"
                >
                  Contraseña
                </label>
                <div className="flex items-center gap-3 border border-gym-border-strong bg-gym-bg/50 focus-within:border-gym-gold transition-colors">
                  <span className="pl-3 text-gym-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    className="flex-1 bg-transparent py-3 pr-3 text-gym-chalk placeholder:text-gym-text-tertiary focus:outline-none disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.password?.[0] && (
                  <p className="mt-2 text-xs text-red-400">{fieldErrors.password[0]}</p>
                )}
              </div>

              {errorMessage && Object.keys(fieldErrors).length === 0 && (
                <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gym-gold text-gym-gold-text px-6 py-4 font-black text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Ingresando…" : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-6 text-xs text-gym-text-tertiary text-center">
              ¿No tenés cuenta? Pedísela en el gym a Cris.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
