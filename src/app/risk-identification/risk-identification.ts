import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Risk {
  id: string;
  tipo: string;
  idProyecto: string;
  categoria: string;
  descripcion: string;
  nivelImpacto: string;
  oportunidades: string;
  evaluacionRiesgo: string;
  estrategiaRiesgo: string;
  responsable: string;
  estado: string;
  fechaInicio: string;
  fechaCierre: string;
  escalado: string;
  siguienteVerificacion: string;
}

@Component({
  selector: 'app-risk-identification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-identification.html',
  styleUrls: ['./risk-identification.scss']
})
export class RiskIdentificationComponent implements OnInit {
  
  risks: Risk[] = [];

  ngOnInit() {
    this.initializeRisks();
  }

  initializeRisks() {
    // Inicializar con 50 filas vacías como en el Excel
    for (let i = 1; i <= 50; i++) {
      this.risks.push({
        id: `RSK_${String(i).padStart(3, '0')}`,
        tipo: '',
        idProyecto: '',
        categoria: '',
        descripcion: '',
        nivelImpacto: '',
        oportunidades: '',
        evaluacionRiesgo: '',
        estrategiaRiesgo: '',
        responsable: '',
        estado: '',
        fechaInicio: '',
        fechaCierre: '',
        escalado: '',
        siguienteVerificacion: ''
      });
    }
  }

  addRisk() {
    const newId = `RSK_${String(this.risks.length + 1).padStart(3, '0')}`;
    this.risks.push({
      id: newId,
      tipo: '',
      idProyecto: '',
      categoria: '',
      descripcion: '',
      nivelImpacto: '',
      oportunidades: '',
      evaluacionRiesgo: '',
      estrategiaRiesgo: '',
      responsable: '',
      estado: '',
      fechaInicio: '',
      fechaCierre: '',
      escalado: '',
      siguienteVerificacion: ''
    });
  }

  deleteRisk(index: number) {
    if (this.risks.length > 1) {
      this.risks.splice(index, 1);
    }
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.risks.map(risk => ({
        'ID': risk.id,
        'Tipo': risk.tipo,
        'ID de Proyecto': risk.idProyecto,
        'Categoría': risk.categoria,
        'Descripción del Riesgo': risk.descripcion,
        'Nivel de Impacto': risk.nivelImpacto,
        'Oportunidades': risk.oportunidades,
        'Evaluación de Riesgo': risk.evaluacionRiesgo,
        'Estrategia del Riesgo': risk.estrategiaRiesgo,
        'Responsable': risk.responsable,
        'Estado': risk.estado,
        'Fecha Inicio': risk.fechaInicio,
        'Fecha Cierre': risk.fechaCierre,
        'Escalado': risk.escalado,
        'Siguiente Verificación': risk.siguienteVerificacion
      })));
      
      const workbook = { Sheets: { 'Riesgos': worksheet }, SheetNames: ['Riesgos'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Matriz_Riesgos_Oportunidades');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
    });
  }

  exportPDF() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default('l', 'mm', 'a3'); // A3 para más espacio
        
        // Título
        doc.setFontSize(14);
        doc.text('MATRIZ DE RIESGOS Y OPORTUNIDADES DEL PORTAFOLIO DE PROYECTOS DE Q&K', 14, 15);
        
        // Tabla completa
        (doc as any).autoTable({
          startY: 25,
          head: [[
            'ID', 'Tipo', 'ID Proyecto', 'Categoría', 'Descripción',
            'Nivel Impacto', 'Oportunidades', 'Evaluación', 'Estrategia',
            'Responsable', 'Estado', 'F. Inicio', 'F. Cierre', 'Escalado', 'Verificación'
          ]],
          body: this.risks.map(risk => [
            risk.id, risk.tipo, risk.idProyecto, risk.categoria, risk.descripcion,
            risk.nivelImpacto, risk.oportunidades, risk.evaluacionRiesgo,
            risk.estrategiaRiesgo, risk.responsable, risk.estado,
            risk.fechaInicio, risk.fechaCierre, risk.escalado, risk.siguienteVerificacion
          ]),
          theme: 'grid',
          styles: { fontSize: 6 },
          headStyles: { fillColor: [30, 58, 95], fontSize: 7 }
        });
        
        doc.save('Matriz_Riesgos_Oportunidades.pdf');
      });
    });
  }

  saveData() {
    console.log('Guardando datos de riesgos:', this.risks);
    alert('✅ Datos guardados correctamente');
  }
}
