import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-risk-matrix',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-matrix.html',
  styleUrls: ['./risk-matrix.scss']
})
export class RiskMatrix {
  exportExcel() {
    // Obtener la tabla del DOM
    const table: HTMLTableElement | null = document.querySelector('.rmx-control-table');
    if (!table) return;
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent || '');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = cells[i]?.textContent || '';
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
    // Obtener la tabla del DOM
    const table: HTMLTableElement | null = document.querySelector('.rmx-control-table');
    if (!table) return;
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent || '');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => td.textContent || '');
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
}
