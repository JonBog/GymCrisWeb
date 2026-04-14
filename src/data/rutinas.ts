/**
 * Datos mock de la rutina vigente del ciclo quincenal.
 * Shape espejado de Laravel (AppGym_Laravel) — rutinas > dias > ejercicios.
 * Cuando exista API real (Sanctum en Laravel), reemplazar por fetch a
 * `/api/v1/rutinas/vigente` manteniendo este tipo.
 */

export type Ejercicio = {
  orden: number;
  nombre: string;
  serieFormato: string; // gated: solo visible para socios
};

export type Dia = {
  orden: number;
  nombre: string;
  grupos: string[];
  ejercicios: Ejercicio[];
};

export type Rutina = {
  id: number;
  nombre: string;
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
  tipo: "quincenal" | "mensual" | "semanal" | "plantilla";
  dias: Dia[];
};

export const RUTINA_VIGENTE: Rutina = {
  id: 1,
  nombre: "Abril 2026 — Semana 1-2",
  desde: "2026-04-01",
  hasta: "2026-04-15",
  tipo: "quincenal",
  dias: [
    {
      orden: 1,
      nombre: "Día 1 · Pecho + Tríceps",
      grupos: ["Pectorales", "Tríceps"],
      ejercicios: [
        { orden: 1, nombre: "Press plano c/barra", serieFormato: "4 x 10" },
        { orden: 2, nombre: "Press inclinado c/manc.", serieFormato: "12-10-8-6" },
        { orden: 3, nombre: "Apertura c/manc.", serieFormato: "4 x 12" },
        { orden: 4, nombre: "Cruce c/cables", serieFormato: "4 x 15" },
        { orden: 5, nombre: "Fondos", serieFormato: "4 x fallo" },
        { orden: 6, nombre: "Polea alta c/soga", serieFormato: "15-12-10-8" },
        { orden: 7, nombre: "Press Francés c/barra", serieFormato: "4 x 12" },
        { orden: 8, nombre: "Copa en polea", serieFormato: "15-12-10-drop set" },
        { orden: 9, nombre: "Patada de burro c/manc.", serieFormato: "4 x 15" },
      ],
    },
    {
      orden: 2,
      nombre: "Día 2 · Espalda + Bíceps",
      grupos: ["Espalda", "Bíceps"],
      ejercicios: [
        { orden: 1, nombre: "Dominadas", serieFormato: "4 x fallo" },
        { orden: 2, nombre: "Jalón abierto al pecho", serieFormato: "12-10-8-6" },
        { orden: 3, nombre: "Remo c/barra prono", serieFormato: "4 x 10" },
        { orden: 4, nombre: "Remo sentado en máquina neutro", serieFormato: "4 x 12" },
        { orden: 5, nombre: "Pull over c/soga", serieFormato: "4 x 15" },
        { orden: 6, nombre: "Curl c/barra parado", serieFormato: "15-12-10-8" },
        { orden: 7, nombre: "Martillo c/manc. parado", serieFormato: "4 x 12" },
        { orden: 8, nombre: "Banco Scott c/barra", serieFormato: "12-10-8-rest pause" },
        { orden: 9, nombre: "Polea baja c/soga", serieFormato: "4 x 15" },
      ],
    },
    {
      orden: 3,
      nombre: "Día 3 · Cuádriceps + Glúteos",
      grupos: ["Cuádriceps", "Glúteos"],
      ejercicios: [
        { orden: 1, nombre: "Sentadilla libre", serieFormato: "4 x 8" },
        { orden: 2, nombre: "Prensa", serieFormato: "20-15-12-10" },
        { orden: 3, nombre: "Sentadilla Hack 45", serieFormato: "4 x 12" },
        { orden: 4, nombre: "Sillón de cuádriceps", serieFormato: "4 x 15" },
        { orden: 5, nombre: "Hip thrust", serieFormato: "4 x 10" },
        { orden: 6, nombre: "Zancadas caminando", serieFormato: "4 x 20" },
        { orden: 7, nombre: "Patada en máquina", serieFormato: "15-12-10-10" },
        { orden: 8, nombre: "Abducción sentada en máquina", serieFormato: "20-15-12-drop set" },
      ],
    },
    {
      orden: 4,
      nombre: "Día 4 · Hombros + Trapecios",
      grupos: ["Hombros", "Trapecios"],
      ejercicios: [
        { orden: 1, nombre: "Press Militar c/manc.", serieFormato: "4 x 10" },
        { orden: 2, nombre: "Press Arnold c/manc.", serieFormato: "12-10-8-6" },
        { orden: 3, nombre: "Vuelo lateral c/manc.", serieFormato: "4 x 15" },
        { orden: 4, nombre: "Vuelo frontal c/soga", serieFormato: "4 x 12" },
        { orden: 5, nombre: "Posterior en máquina", serieFormato: "15-12-10-8" },
        { orden: 6, nombre: "Encogimiento c/barra", serieFormato: "4 x 12" },
        { orden: 7, nombre: "Remo al mentón c/barra", serieFormato: "4 x 15" },
        { orden: 8, nombre: "Encogimiento c/manc.", serieFormato: "15-12-10-drop set" },
      ],
    },
    {
      orden: 5,
      nombre: "Día 5 · Femorales + Pantorrillas + Abs",
      grupos: ["Femorales", "Pantorrillas", "Zona Media"],
      ejercicios: [
        { orden: 1, nombre: "Peso muerto c/barra", serieFormato: "4 x 8" },
        { orden: 2, nombre: "Camilla", serieFormato: "12-10-8-6" },
        { orden: 3, nombre: "Sillón femoral", serieFormato: "4 x 15" },
        { orden: 4, nombre: "Femoral parada en máquina", serieFormato: "4 x 12" },
        { orden: 5, nombre: "Pantorrilla parada en máquina", serieFormato: "4 x 20" },
        { orden: 6, nombre: "Pantorrilla en prensa", serieFormato: "4 x 15" },
        { orden: 7, nombre: "Pantorrilla sentada", serieFormato: "4 x 30" },
        { orden: 8, nombre: "Plancha", serieFormato: "4 x fallo" },
        { orden: 9, nombre: "Crunch c/soga", serieFormato: "4 x 20" },
        { orden: 10, nombre: "Rueda", serieFormato: "4 x 12" },
      ],
    },
  ],
};
