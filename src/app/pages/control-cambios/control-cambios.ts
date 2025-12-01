import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlCambiosService, ControlCambio } from '../../services/control-cambios.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-control-cambios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Control de Cambios</h2>
    <form (ngSubmit)="guardarCambio()">
      <label>Versión</label>
      <input type="text" [(ngModel)]="cambio.version" name="version" required />
      <label>Fecha</label>
      <input type="date" [(ngModel)]="cambio.fecha" name="fecha" required />
      <label>Descripción</label>
      <input type="text" [(ngModel)]="cambio.descripcion" name="descripcion" required />
      <label>Autor</label>
      <input type="text" [(ngModel)]="cambio.autor" name="autor" required />
      <label>Aprobó</label>
      <input type="text" [(ngModel)]="cambio.aprobo" name="aprobo" required />
      <button type="submit">Guardar</button>
    </form>
    <div *ngIf="mensaje">{{ mensaje }}</div>
  `
})
export class ControlCambiosComponent {
  cambio: ControlCambio = { version: '', fecha: '', descripcion: '', autor: '', aprobo: '' };
  mensaje = '';

  constructor(private controlCambiosService: ControlCambiosService) {}

  guardarCambio() {
    if (!this.cambio.version || !this.cambio.fecha || !this.cambio.descripcion || !this.cambio.autor || !this.cambio.aprobo) {
      this.mensaje = 'Completa todos los campos';
      return;
    }
    this.controlCambiosService.crearCambio(this.cambio).subscribe({
      next: () => {
        this.mensaje = 'Cambio guardado correctamente';
        this.cambio = { version: '', fecha: '', descripcion: '', autor: '', aprobo: '' };
      },
      error: (err) => {
        this.mensaje = 'Error al guardar: ' + (err?.message || err);
      }
    });
  }

  exportarExcel() {
    const data = [
      {
        Versión: this.cambio.version,
        Fecha: this.cambio.fecha,
        Descripción: this.cambio.descripcion,
        Autor: this.cambio.autor,
        Aprobó: this.cambio.aprobo
      }
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Cambios': worksheet }, SheetNames: ['Cambios'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'control_cambios.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Control de Cambios', 14, 15);
    autoTable(doc, {
      head: [['Versión', 'Fecha', 'Descripción', 'Autor', 'Aprobó']],
      body: [[
        this.cambio.version,
        this.cambio.fecha,
        this.cambio.descripcion,
        this.cambio.autor,
        this.cambio.aprobo
      ]],
      startY: 20
    });
    doc.save('control_cambios.pdf');
  }
}
