import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ControlCambio {
  version: string;
  fecha: string;
  descripcion: string;
  autor: string;
  aprobo: string;
}

@Injectable({ providedIn: 'root' })
export class ControlCambiosService {
  private apiUrl = `${environment.apiUrl}/cambios`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  crearCambio(cambio: ControlCambio): Observable<any> {
    return this.http.post(this.apiUrl, cambio, this.httpOptions);
  }
}
