import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Riesgo } from '../models/riesgo.model';

@Injectable({
  providedIn: 'root'
})
export class RiesgosService {
  private apiUrl = `${environment.apiUrl}/riesgos`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // ============================================
  // OPERACIONES CRUD PRINCIPALES
  // ============================================
  
  /**
   * Crear un nuevo riesgo
   * POST /api/riesgos
   */
  createRiesgo(riesgo: Riesgo): Observable<Riesgo> {
    return this.http.post<Riesgo>(this.apiUrl, riesgo, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener todos los riesgos
   * GET /api/riesgos
   */
  getAllRiesgos(): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener un riesgo por ID
   * GET /api/riesgos/{id}
   */
  getRiesgoById(id: number): Observable<Riesgo> {
    return this.http.get<Riesgo>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualizar un riesgo existente
   * PUT /api/riesgos/{id}
   */
  updateRiesgo(id: number, riesgo: Riesgo): Observable<Riesgo> {
    return this.http.put<Riesgo>(`${this.apiUrl}/${id}`, riesgo, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Eliminar un riesgo
   * DELETE /api/riesgos/{id}
   */
  deleteRiesgo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // CONSULTAS ESPECIALIZADAS
  // ============================================

  /**
   * Obtener riesgos de un proyecto específico
   * GET /api/riesgos/proyecto/{idDelProyecto}
   */
  getRiesgosByProyecto(idDelProyecto: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/proyecto/${idDelProyecto}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por tipo
   * GET /api/riesgos/tipo/{tipo}
   */
  getRiesgosByTipo(tipo: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/tipo/${tipo}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por categoría
   * GET /api/riesgos/categoria/{categoria}
   */
  getRiesgosByCategoria(categoria: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/categoria/${categoria}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por estatus
   * GET /api/riesgos/estatus/{estatus}
   */
  getRiesgosByEstatus(estatus: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/estatus/${estatus}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por responsable
   * GET /api/riesgos/responsable/{responsable}
   */
  getRiesgosByResponsable(responsable: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/responsable/${responsable}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por nivel de impacto
   * GET /api/riesgos/impacto/{nivel}
   */
  getRiesgosByImpacto(nivel: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/impacto/${nivel}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener riesgos por probabilidad
   * GET /api/riesgos/probabilidad/{probabilidad}
   */
  getRiesgosByProbabilidad(probabilidad: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/probabilidad/${probabilidad}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // MÉTODOS DE COMPATIBILIDAD
  // ============================================
  
  obtenerRiesgos(): Observable<Riesgo[]> {
    return this.getAllRiesgos();
  }

  obtenerRiesgoPorId(id: number): Observable<Riesgo> {
    return this.getRiesgoById(id);
  }

  crearRiesgo(riesgo: Riesgo): Observable<Riesgo> {
    return this.createRiesgo(riesgo);
  }

  actualizarRiesgo(id: number, riesgo: Riesgo): Observable<Riesgo> {
    return this.updateRiesgo(id, riesgo);
  }

  eliminarRiesgo(id: number): Observable<void> {
    return this.deleteRiesgo(id);
  }

  getRiesgos(): Observable<Riesgo[]> {
    return this.getAllRiesgos();
  }

  // ============================================
  // MANEJO DE ERRORES
  // ============================================
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.error && typeof error.error === 'object') {
        errorMessage += `\nDetalles: ${JSON.stringify(error.error)}`;
      }
    }
    
    console.error('❌ Error en RiesgosService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
