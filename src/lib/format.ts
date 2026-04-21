export function formatMoneda(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatFechaCorta(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

/** "7 abr 2026" — día sin cero + mes corto + año. Ideal para listas en mobile. */
export function formatFechaMedia(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatFechaLarga(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

/** Saca el prefijo "Día N:" del nombre de un día de rutina — solo queda la descripción. */
export function descripcionDelDia(nombre: string): string {
  const colonIdx = nombre.indexOf(":");
  if (colonIdx < 0) return nombre;
  const resto = nombre.slice(colonIdx + 1).trim();
  return resto.length > 0 ? resto : nombre;
}
