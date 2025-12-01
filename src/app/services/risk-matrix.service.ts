import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RiskMatrix, ControlCambio } from '../models/risk-matrix.model';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class RiskMatrixService {
  private apiUrl = `${environment.apiUrl}/risk-matrix`;
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
}
