import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RiskMatrixService } from '../services/risk-matrix.service';
import { RiskMatrix as RiskMatrixModel, ControlCambio } from '../models/risk-matrix.model';

@Component({
  selector: 'app-risk-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './risk-matrix.html',
  styleUrls: ['./risk-matrix.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RiskMatrix implements OnInit {
  matrixData: any = {
    totalRiesgos: 0,
    criticos: 0,
    mitigados: 0,
    cambiosRecientes: 0,
    proyecto: '',
    clave: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    controlCambios: []
  };
  currentMatrixId?: number;
  isSaving: boolean = false;
  saveMessage: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private riskMatrixService: RiskMatrixService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.matrixData = this.matrixData || {
      totalRiesgos: 0,
      criticos: 0,
      mitigados: 0,
      cambiosRecientes: 0,
      proyecto: '',
      clave: '',
      responsable: '',
      fechaInicio: '',
      fechaFin: '',
      controlCambios: []
    };
    this.loadLatestMatrix();
  }

  loadLatestMatrix(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.matrixData = null;
    this.riskMatrixService.getLatestMatrix().subscribe((data) => {
      this.isLoading = false;
      if (data && data.id) {
        this.matrixData = data;
        this.currentMatrixId = data.id;
        this.saveMessage = '';
      } else {
        // No existe matriz, mostrar estado neutro y permitir crear
        this.matrixData = {
          totalRiesgos: 0,
          criticos: 0,
          mitigados: 0,
          cambiosRecientes: 0,
          proyecto: '',
          clave: '',
          responsable: '',
          fechaInicio: '',
          fechaFin: '',
          controlCambios: []
        };
        this.currentMatrixId = undefined;
        this.saveMessage = '';
      }
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = 'Error: Backend no disponible';
    });
  }

  saveMatrix(): void {
    this.isSaving = true;
    if (this.currentMatrixId) {
      this.riskMatrixService.updateMatrix(this.currentMatrixId, this.matrixData).subscribe({
        next: (data) => {
          this.isSaving = false;
          this.saveMessage = '¡Matriz actualizada correctamente!';
          this.matrixData = data;
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = 'Error al actualizar la matriz.';
        }
      });
    } else {
      this.riskMatrixService.createMatrix(this.matrixData).subscribe({
        next: (data) => {
          this.isSaving = false;
          this.saveMessage = '¡Matriz creada correctamente!';
          this.matrixData = data;
          this.currentMatrixId = data.id;
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = 'Error al crear la matriz.';
        }
      });
    }
  }

  // Método para actualizar estadísticas en tiempo real
  updateStatistics(): void {
    // Aquí puedes implementar lógica personalizada para calcular estadísticas
    // Por ahora, las estadísticas se mantienen como están editadas manualmente
    if (!this.matrixData) return;
    console.log('Estadísticas actualizadas:', {
      totalRiesgos: this.matrixData.totalRiesgos,
      criticos: this.matrixData.criticos,
      mitigados: this.matrixData.mitigados,
      cambiosRecientes: this.matrixData.cambiosRecientes
    });
  }

  // Método para agregar nueva fila de control de cambios
  addControlCambio(): void {
    this.matrixData.controlCambios.push({
      version: '',
      fecha: '',
      descripcion: '',
      autor: '',
      aprobo: ''
    });
  }

  /**
   * Guardar una fila específica del Control de Cambios en el backend externo
   */
  saveControlCambio(index: number): void {
    const controlCambio = this.matrixData.controlCambios[index];
    if (controlCambio.id) {
      this.riskMatrixService.updateControlCambio(controlCambio.id, controlCambio).subscribe({
        next: (data) => {
          this.matrixData.controlCambios[index] = data;
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Control de cambio actualizado.' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el control de cambio.' });
        }
      });
    } else {
      this.riskMatrixService.createControlCambio(controlCambio).subscribe({
        next: (data) => {
          this.matrixData.controlCambios[index] = data;
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Control de cambio guardado.' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el control de cambio.' });
        }
      });
    }
  }

  deleteControlCambio(index: number): void {
    const controlCambio = this.matrixData.controlCambios[index];
    if (controlCambio.id) {
      this.riskMatrixService.deleteControlCambio(controlCambio.id).subscribe({
        next: () => {
          this.matrixData.controlCambios.splice(index, 1);
          this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Control de cambio eliminado.' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el control de cambio.' });
        }
      });
    } else {
      this.matrixData.controlCambios.splice(index, 1);
      this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Control de cambio eliminado localmente.' });
    }
  }

  exportExcel() {
    const table: HTMLTableElement | null = document.querySelector('.rmx-control-table');
    if (!table) return;
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent || '');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('input'));
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = cells[i]?.value || '';
      });
      return obj;
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Riesgos': worksheet }, SheetNames: ['Riesgos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'matriz_riesgos.xlsx');
  }

  exportPDF() {
    const table: HTMLTableElement | null = document.querySelector('.rmx-control-table');
    if (!table) return;
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent || '');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(tr => {
      return Array.from(tr.querySelectorAll('input')).map(input => input.value || '');
    });
    const doc = new jsPDF();
    doc.text('Matriz de Riesgos y Control de Cambios', 14, 15);
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20
    });
    doc.save('matriz_riesgos.pdf');
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  customAction1(): void {
    this.messageService.add({ severity: 'info', summary: 'Buscar', detail: 'Acción de búsqueda ejecutada.' });
  }

  customAction2(): void {
    this.messageService.add({ severity: 'info', summary: 'Exportar', detail: 'Acción de exportación ejecutada.' });
  }

  navigateTo(route: string): void {
    // Implementación de navegación
    console.log(`Navegando a: ${route}`);
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: `Navegando a: ${route}` });
  }
}
