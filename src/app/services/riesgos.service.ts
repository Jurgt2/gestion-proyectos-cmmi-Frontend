import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Riesgo {
  descripcion: string;
  probabilidad: string;
  impacto: string;
  estado: string;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class RiesgosService {
  private apiUrl = `${environment.apiUrl}/riesgos`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  crearRiesgo(riesgo: Riesgo): Observable<any> {
    return this.http.post(this.apiUrl, riesgo, this.httpOptions);
  }
    getRiesgos(): Observable<Riesgo[]> {
      return this.http.get<Riesgo[]>(this.apiUrl, this.httpOptions);
    }
}
