export type EstadoMembresia = "al_dia" | "por_vencer" | "vencido" | "sin_membresia";

export type PlanInfo = {
  id: number;
  Nombre: string;
  Monto: number;
  CantidadPeriodo: number;
  periodo: string | null;
  EsPromocion: boolean;
};

export type AbonoInfo = {
  id: number;
  FechaComienzo: string | null;
  FechaVencimiento: string | null;
  Monto: number;
  Descuento: number;
};

export type EstadoCuenta = {
  estado: EstadoMembresia;
  dias_restantes: number | null;
  vence_el: string | null;
  con_deuda: boolean;
  plan: PlanInfo | null;
  abono: AbonoInfo | null;
};

export type FormaPago = {
  id: number;
  Monto: number;
  IdTipoPago: number;
  tipo: { Nombre: string; Abreviatura: string } | null;
};

export type Pago = {
  id: number;
  Fecha: string | null;
  Monto: number;
  formas_pago: FormaPago[];
};

export type PagosResponse = {
  data: Pago[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type RutinaDiaEjercicio = {
  id: number;
  Orden: number;
  Notas: string | null;
  ejercicio: {
    id: number;
    Nombre: string;
    Notas: string | null;
    UrlVideo: string | null;
    grupo_muscular: { Nombre: string } | null;
    tipo_equipamiento: { Nombre: string } | null;
  };
  serie_formato: {
    id: number;
    Nombre: string;
    Descripcion: string | null;
    metodo_entrenamiento: { Nombre: string } | null;
  };
};

export type RutinaDia = {
  id: number;
  Nombre: string;
  Orden: number;
  Notas: string | null;
  ejercicios: RutinaDiaEjercicio[];
};

export type Rutina = {
  id: number;
  Nombre: string;
  Tipo: string;
  FechaDesde: string | null;
  FechaHasta: string | null;
  Notas: string | null;
  dias: RutinaDia[];
};
