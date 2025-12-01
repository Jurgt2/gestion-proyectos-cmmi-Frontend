export interface RiskMatrix {
  id?: number;
  proyecto: string;
  clave: string;
  responsable: string;
  fechaInicio: string;
  fechaFin: string;
  totalRiesgos: number;
  criticos: number;
  mitigados: number;
  cambiosRecientes: number;
  controlCambios: ControlCambio[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ControlCambio {
  id?: number;
  version: string;
  fecha: string;
  descripcion: string;
  autor: string;
  aprobo: string;
}
