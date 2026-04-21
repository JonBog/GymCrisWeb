export type TvEjercicio = {
  nombre: string;
  grupo: string;
  series: string;
};

export type TvDia = {
  nombre: string;
  tag: string;
  ejercicios: TvEjercicio[];
};

export type TvRutina = {
  nombre: string;
  fechaDesde: string;
  fechaHasta: string;
  dias: TvDia[];
};
