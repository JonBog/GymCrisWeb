"use client";

import { useEffect } from "react";
import { Close } from "./icons/GymIcons";
import { toEmbed } from "@/lib/video";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string | null;
  title?: string;
};

export function VideoModal({ open, onClose, url, title }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !url) return null;

  const video = toEmbed(url);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="fixed inset-0 bg-gym-bg/90 backdrop-blur-md cursor-default"
      />

      <div className="relative min-h-full flex items-start md:items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-3xl bg-gym-surface border border-gym-border-strong grain my-auto">
          <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-gym-border gap-3">
            <span
              id="video-title"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gym-text-secondary truncate"
            >
              {title ?? "Video del ejercicio"}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-gym-text-tertiary hover:text-gym-chalk transition-colors p-1 shrink-0"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>

          {video.kind === "youtube" ? (
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={video.embedUrl}
                title={title ?? "Video del ejercicio"}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="px-6 md:px-10 py-10 md:py-12 text-center">
              <p className="text-gym-text-secondary text-sm leading-relaxed mb-6">
                Este video no se puede ver embebido. Abrilo en otra pestaña.
              </p>
              <a
                href={video.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gym-gold text-gym-gold-text px-6 py-3 font-black text-sm uppercase tracking-wider hover:bg-gym-tungsten transition-colors"
              >
                Abrir video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
