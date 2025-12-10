import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RiskMatrix, ControlCambio } from '../models/risk-matrix.model';
import { environment } from '../../environments/environment';

// 📦 Interfaces para manejar proyectos
export interface ProyectoRequest {
  nombreProyecto: string;
  claveProyecto: string;
  fechaCreacion?: string;
  ultimaActualizacion?: string;
}

export interface ProyectoResponse {
  id: number;
  nombre: string;
  clave: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

// 📦 Interfaces para manejar cambios
export interface CambioRequest {
  version: string;
  fecha: string;  // formato ISO: "2025-12-03T07:32:35.794"
  descripcion: string;
  autor: string;
  aprobo: string;
  riesgoId?: number;  // opcional, puede ser null
}

export interface CambioResponse {
  id: number;
  version: string;
  fecha: string;
  descripcion: string;
  autor: string;
  aprobo: string;
  riesgoId?: number;
}

@Injectable({ providedIn: 'root' })
export class RiskMatrixService {
  private apiUrl = `${environment.apiUrl}/proyectos`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllMatrices(): Observable<RiskMatrix[]> {
    return this.http.get<RiskMatrix[]>(this.apiUrl);
  }

  createControlCambio(controlCambio: any): Observable<any> {
    const url = `${environment.apiUrl}/control-changes`;
    return this.http.post<any>(url, controlCambio, this.httpOptions);
  }

  updateControlCambio(id: number, controlCambio: ControlCambio): Observable<ControlCambio> {
    const url = `${environment.apiUrl}/control-changes/${id}`;
    return this.http.put<ControlCambio>(url, controlCambio, this.httpOptions);
  }

  deleteControlCambio(id: number): Observable<any> {
    const url = `${environment.apiUrl}/control-changes/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  getMatrixById(id: number): Observable<RiskMatrix> {
    return this.http.get<RiskMatrix>(`${this.apiUrl}/${id}`);
  }

  getLatestMatrix(): Observable<RiskMatrix | null> {
    return this.http.get<RiskMatrix>(`${this.apiUrl}/latest`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      })
    );
  }

  createMatrix(matrix: RiskMatrix): Observable<RiskMatrix> {
    return this.http.post<RiskMatrix>(this.apiUrl, matrix, this.httpOptions);
  }

  updateMatrix(id: number, matrix: RiskMatrix): Observable<RiskMatrix> {
    return this.http.put<RiskMatrix>(`${this.apiUrl}/${id}`, matrix, this.httpOptions);
  }

  deleteMatrix(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  /**
   * 💾 Método específico para guardar proyecto
   * Envía solo nombre y clave al backend
   */
  guardarProyecto(proyectoData: ProyectoRequest): Observable<ProyectoResponse> {
  console.log('📤 Enviando proyecto al backend (payload):', proyectoData);
    return this.http.post<ProyectoResponse>(this.apiUrl, proyectoData, this.httpOptions);
  }

  /**
   * 📋 Método para obtener todos los proyectos
   */
  obtenerProyectos(): Observable<ProyectoResponse[]> {
    return this.http.get<ProyectoResponse[]>(this.apiUrl, this.httpOptions);
  }

  /**
   * 🔍 Método para obtener un proyecto por ID
   */
  obtenerProyectoPorId(id: number): Observable<ProyectoResponse> {
    return this.http.get<ProyectoResponse>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // ==================== MÉTODOS PARA CONTROL DE CAMBIOS ====================

  /**
   * 📋 Obtener todos los cambios
   */
  obtenerCambios(): Observable<CambioResponse[]> {
    const url = `${environment.apiUrl}/cambios`;
    return this.http.get<CambioResponse[]>(url, this.httpOptions);
  }

  /**
   * 💾 Crear un nuevo cambio
   */
  crearCambio(cambio: CambioRequest): Observable<CambioResponse> {
    const url = `${environment.apiUrl}/cambios`;
    console.log('📤 Enviando cambio al backend:', cambio);
    return this.http.post<CambioResponse>(url, cambio, this.httpOptions);
  }

  /**
   * ✏️ Actualizar un cambio existente
   */
  actualizarCambio(id: number, cambio: CambioRequest): Observable<CambioResponse> {
    const url = `${environment.apiUrl}/cambios/${id}`;
    return this.http.put<CambioResponse>(url, cambio, this.httpOptions);
  }

  /**
   * 🗑️ Eliminar un cambio
   */
  eliminarCambio(id: number): Observable<any> {
    const url = `${environment.apiUrl}/cambios/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  /**
   * 🔍 Obtener cambios por ID de riesgo/proyecto
   */
  obtenerCambiosPorRiesgo(riesgoId: number): Observable<CambioResponse[]> {
    const url = `${environment.apiUrl}/cambios/riesgo/${riesgoId}`;
    return this.http.get<CambioResponse[]>(url, this.httpOptions);
  }
}
