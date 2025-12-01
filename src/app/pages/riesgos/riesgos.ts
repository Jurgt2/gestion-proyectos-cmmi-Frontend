import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiesgosService, Riesgo } from '../../services/riesgos.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-riesgos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Listado de Riesgos</h2>
    <form (ngSubmit)="guardarRiesgo()">
      <label>Descripción</label>
      <input type="text" [(ngModel)]="riesgo.descripcion" name="descripcion" required />
      <label>Probabilidad</label>
      <input type="text" [(ngModel)]="riesgo.probabilidad" name="probabilidad" required />
      <label>Impacto</label>
      <input type="text" [(ngModel)]="riesgo.impacto" name="impacto" required />
      <label>Estado</label>
      <input type="text" [(ngModel)]="riesgo.estado" name="estado" required />
      <label>Categoría</label>
      <input type="text" [(ngModel)]="riesgo.categoria" name="categoria" required />
      <button type="submit">Guardar</button>
    </form>
    <div *ngIf="mensaje">{{ mensaje }}</div>
  `
})
export class RiesgosComponent {
  riesgo: Riesgo = { descripcion: '', probabilidad: '', impacto: '', estado: '', categoria: '' };
  riesgos: Riesgo[] = [];
  mensaje = '';

  constructor(private riesgosService: RiesgosService) {
    this.cargarRiesgos();
  }

  guardarRiesgo() {
    if (!this.riesgo.descripcion || !this.riesgo.probabilidad || !this.riesgo.impacto || !this.riesgo.estado || !this.riesgo.categoria) {
      this.mensaje = 'Completa todos los campos';
      return;
    }
    this.riesgosService.crearRiesgo(this.riesgo).subscribe({
      next: () => {
        this.mensaje = 'Riesgo guardado correctamente';
        this.riesgo = { descripcion: '', probabilidad: '', impacto: '', estado: '', categoria: '' };
        this.cargarRiesgos();
      },
      error: (err) => {
        this.mensaje = 'Error al guardar: ' + (err?.message || err);
      }
    });
  }

  cargarRiesgos() {
    this.riesgosService.getRiesgos().subscribe({
      next: (data) => {
        this.riesgos = data;
      },
      error: (err) => {
        this.mensaje = 'Error al cargar riesgos: ' + (err?.message || err);
      }
    });
  }

  exportarExcel() {
    const data = [
      {
        Descripción: this.riesgo.descripcion,
        Probabilidad: this.riesgo.probabilidad,
        Impacto: this.riesgo.impacto,
        Estado: this.riesgo.estado,
        Categoría: this.riesgo.categoria
      }
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Riesgos': worksheet }, SheetNames: ['Riesgos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'riesgos.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Listado de Riesgos', 14, 15);
    autoTable(doc, {
      head: [['Descripción', 'Probabilidad', 'Impacto', 'Estado', 'Categoría']],
      body: [[
        this.riesgo.descripcion,
        this.riesgo.probabilidad,
        this.riesgo.impacto,
        this.riesgo.estado,
        this.riesgo.categoria
      ]],
      startY: 20
    });
    doc.save('riesgos.pdf');
  }
}
