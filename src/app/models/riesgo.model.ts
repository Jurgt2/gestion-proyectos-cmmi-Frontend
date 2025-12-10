export interface Riesgo {
  id?: number;
  tipo: string;
  idDelProyecto: string;
  categoria: string;
  descripcionDelRiesgo: string;
  consecuencia: string;
  identificadoPor: string;
  fechaDeRegistro?: string; // ISO 8601 format, generado por backend
  nivelDeImpactoTotal: string;
  probabilidadDeOcurrencia: string;
  evaluacionDeRiesgos: string;
  estrategiaDelRiesgo: string;
  respuestaAlRiesgo: string;
  responsable: string;
  fechaLimite?: string; // formato "YYYY-MM-DD"
  estatus: string;
  siguienteVerificacion?: string; // formato "YYYY-MM-DD"
  observaciones?: string;
}
