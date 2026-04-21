"use client";

import { useState } from "react";

type Props = {
  variant: "no-token" | "invalid-token";
  onSave: (token: string) => void;
};

export function TvDeviceSetup({ variant, onSave }: Props) {
  const [token, setToken] = useState("");
  const isInvalid = variant === "invalid-token";

  return (
    <div className="h-screen bg-[#050505] text-white flex items-center justify-center px-10 select-none">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#ffd700]" />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#ffd700] font-bold">
            {isInvalid ? "Token inválido" : "Setup inicial"}
          </span>
        </div>

        <h1 className="font-heading text-5xl font-black text-[#ffd700] uppercase tracking-tighter mb-4 leading-none">
          GymCris · TV
        </h1>

        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          {isInvalid
            ? "El token actual fue revocado o es inválido. Pegá un token nuevo para reconectar esta TV."
            : "Pegá el device token para conectar esta TV al backend. El token se genera en el panel con "}
          {!isInvalid && (
            <code className="font-mono text-[#ffd700] text-xs px-1.5 py-0.5 bg-white/5 rounded">
              php artisan tv:token:create
            </code>
          )}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) onSave(token);
          }}
        >
          <label className="block text-[0.6rem] font-mono uppercase tracking-[0.3em] text-white/40 mb-2">
            Device Token
          </label>
          <input
            autoFocus
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="64 caracteres"
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#ffd700] rounded-md"
          />
          <button
            type="submit"
            disabled={!token.trim()}
            className="mt-6 w-full py-4 bg-[#ffd700] text-[#050505] font-heading text-lg font-black uppercase tracking-wider rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ffdf33] transition-colors"
          >
            Conectar
          </button>
        </form>
      </div>
    </div>
  );
}
