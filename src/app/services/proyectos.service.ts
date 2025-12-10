import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Proyecto {
  id?: number;
  nombreProyecto: string;
  claveProyecto: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

export interface CreateProyectoDto {
  nombreProyecto: string;
  claveProyecto: string;
  fechaCreacion?: string;
  ultimaActualizacion?: string;
}

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  private baseUrl = `${environment.apiUrl}/proyectos`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Obtener todos los proyectos
  getAllProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.baseUrl, this.httpOptions);
  }

  // Obtener proyecto por ID
  getProyectoById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // Obtener proyecto por clave
  getProyectoByClave(clave: string): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}/clave/${clave}`, this.httpOptions);
  }

  // Buscar proyectos por nombre
  buscarProyectos(nombre: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}/buscar?nombre=${nombre}`, this.httpOptions);
  }

  // Crear nuevo proyecto
  createProyecto(proyecto: CreateProyectoDto): Observable<Proyecto> {
    console.log('🚀 Enviando POST a:', this.baseUrl);
    console.log('📦 Datos a enviar:', proyecto);
    return this.http.post<Proyecto>(this.baseUrl, proyecto, this.httpOptions);
  }

  // Actualizar proyecto
  updateProyecto(id: number, proyecto: Proyecto): Observable<Proyecto> {
    console.log('🔄 Enviando PUT a:', `${this.baseUrl}/${id}`);
    console.log('📦 Datos a actualizar:', proyecto);
    return this.http.put<Proyecto>(`${this.baseUrl}/${id}`, proyecto, this.httpOptions);
  }

  // Eliminar proyecto
  deleteProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // Obtener el último proyecto
  getUltimoProyecto(): Observable<Proyecto | null> {
    return this.getAllProyectos().pipe(
      map(proyectos => {
        if (proyectos && proyectos.length > 0) {
          // Retorna el proyecto con el ID más alto
          return proyectos.reduce((prev, current) => 
            ((prev.id || 0) > (current.id || 0)) ? prev : current
          );
        }
        return null;
      })
    );
  }

  // Métodos legacy para compatibilidad
  getLatest(): Observable<Proyecto | null> {
    return this.getUltimoProyecto();
  }

  getAll(): Observable<Proyecto[]> {
    return this.getAllProyectos();
  }
}
