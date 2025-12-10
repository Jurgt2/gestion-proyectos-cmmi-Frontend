import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiesgosService } from '../services/riesgos.service';
import { ProyectosService } from '../services/proyectos.service';
import { Riesgo } from '../models/riesgo.model';
import { RiskMatrix } from '../models/risk-matrix.model';
import { MessageService } from 'primeng/api';

// ========== INTERFACE LOCAL PARA LA TABLA ==========
interface Risk {
  id: string;
  tipo: string;
  idProyecto: string;
  categoria: string;
  descripcion: string;
  consecuencia: string;
  identificadoPor: string;
  fechaRegistro: string;
  nivelImpactoTotal: string;
  probabilidadOcurrencia: string;
  evaluacionRiesgo: string;
  estrategiaRiesgo: string;
  respuestaRiesgo: string;
  responsable: string;
  fechaLimite: string;
  estatus: string;
  siguienteVerificacion: string;
  observaciones: string;
}

@Component({
  selector: 'app-risk-identification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MessageService],
  templateUrl: './risk-identification.html',
  styleUrls: ['./risk-identification.scss']
})
export class RiskIdentificationComponent implements OnInit {
  
  // ========== DATOS DEL PROYECTO ==========
  proyecto: any = {
    nombreProyecto: '',
    claveProyecto: ''
  };
  proyectoId: string = '';
  currentProjectId: number | null = null;

  // ========== DATOS DEL NUEVO RIESGO ==========
  nuevoRiesgo: Partial<Riesgo> = {
    tipo: '',
    idDelProyecto: '',
    categoria: '',
    descripcionDelRiesgo: '',
    consecuencia: '',
    identificadoPor: '',
    nivelDeImpactoTotal: '',
    probabilidadDeOcurrencia: '',
    evaluacionDeRiesgos: '',
    estrategiaDelRiesgo: '',
    respuestaAlRiesgo: '',
    responsable: '',
    fechaLimite: new Date().toISOString().split('T')[0],
    estatus: 'Abierto',
    siguienteVerificacion: new Date().toISOString().split('T')[0],
    observaciones: ''
  };

  // ========== LISTA DE RIESGOS ==========
  listaRiesgos: Riesgo[] = [];
  risks: Risk[] = [];

  // ========== OPCIONES PARA DROPDOWNS ==========
  tiposRiesgo = [
    'Categorías',
    'Alcance',
    'Aplicaciones',
    'Costo',
    'Infraestructura',
    'Proveedores',
    'Recursos',
    'Restricciones regulatorias',
    'Tiempo',
    'Usuarios'
  ];
  categorias = ['Desarrollo', 'Gestión', 'Infraestructura', 'Seguridad', 'Calidad'];
  nivelesImpacto = ['Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy Alto', 'Crítico'];
  probabilidadesOcurrencia = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'];
  estatusOpciones = ['Identificado', 'En Análisis', 'En Tratamiento', 'Mitigado', 'Cerrado'];
  estrategias = ['Evitar', 'Mitigar', 'Transferir', 'Aceptar', 'Prevención'];
  respuestasRiesgo = ['Contingencia', 'Mitigación', 'Transferencia', 'Aceptación', 'Escalamiento'];

  constructor(
    private riesgosService: RiesgosService,
    private proyectosService: ProyectosService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeRisks();
    this.cargarUltimoProyecto();
    this.cargarRiesgos();
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
        consecuencia: '',
        identificadoPor: '',
        fechaRegistro: '',
        nivelImpactoTotal: '',
        probabilidadOcurrencia: '',
        evaluacionRiesgo: '',
        estrategiaRiesgo: '',
        respuestaRiesgo: '',
        responsable: '',
        fechaLimite: '',
        estatus: '',
        siguienteVerificacion: '',
        observaciones: ''
      });
    }
  }

  // ========== MÉTODOS PARA PROYECTO ==========
  
  /**
   * Carga el último proyecto guardado
   */
  cargarUltimoProyecto() {
    this.proyectosService.getUltimoProyecto()
      .subscribe({
        next: (proyecto: any) => {
          if (proyecto) {
            this.proyecto = proyecto;
            this.currentProjectId = proyecto.id || null;
            this.proyectoId = proyecto.claveProyecto || '';
            this.nuevoRiesgo.idDelProyecto = proyecto.claveProyecto || '';
            console.log('✅ Proyecto cargado:', proyecto);
            this.messageService.add({
              severity: 'success',
              summary: 'Proyecto cargado',
              detail: `Proyecto: ${proyecto.nombreProyecto} (${proyecto.claveProyecto})`
            });
          }
        },
        error: (error: any) => {
          console.log('ℹ️ No hay proyectos guardados aún');
          this.messageService.add({
            severity: 'info',
            summary: 'Sin proyectos',
            detail: 'No hay proyectos guardados. Crea uno en la Matriz de Riesgos.'
          });
        }
      });
  }

  // ========== MÉTODOS PARA RIESGOS ==========
  
  /**
   * Carga todos los riesgos guardados
   */
  cargarRiesgos() {
    this.riesgosService.getAllRiesgos()
      .subscribe({
        next: (riesgos: Riesgo[]) => {
          this.listaRiesgos = riesgos;
          console.log('✅ Riesgos cargados:', riesgos);
        },
        error: (error: any) => {
          console.error('❌ Error al cargar riesgos:', error);
        }
      });
  }

  /**
   * Agrega un nuevo riesgo
   */
  agregarRiesgo() {
    // Validar campos obligatorios
    if (!this.nuevoRiesgo.categoria || !this.nuevoRiesgo.descripcionDelRiesgo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor completa los campos obligatorios (Categoría y Descripción)'
      });
      return;
    }

    // Validar que exista un proyecto
    if (!this.proyectoId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Proyecto requerido',
        detail: 'Primero debes guardar la información del proyecto'
      });
      return;
    }

    // Preparar los datos según el modelo Riesgo
    const riesgoData: Riesgo = {
      tipo: this.nuevoRiesgo.tipo || '',
      idDelProyecto: this.proyectoId,
      categoria: this.nuevoRiesgo.categoria!,
      descripcionDelRiesgo: this.nuevoRiesgo.descripcionDelRiesgo!,
      consecuencia: this.nuevoRiesgo.consecuencia || '',
      identificadoPor: this.nuevoRiesgo.identificadoPor || '',
      nivelDeImpactoTotal: this.nuevoRiesgo.nivelDeImpactoTotal || '',
      probabilidadDeOcurrencia: this.nuevoRiesgo.probabilidadDeOcurrencia || '',
      evaluacionDeRiesgos: this.nuevoRiesgo.evaluacionDeRiesgos || '',
      estrategiaDelRiesgo: this.nuevoRiesgo.estrategiaDelRiesgo || '',
      respuestaAlRiesgo: this.nuevoRiesgo.respuestaAlRiesgo || '',
      responsable: this.nuevoRiesgo.responsable || '',
      fechaLimite: this.nuevoRiesgo.fechaLimite,
      estatus: this.nuevoRiesgo.estatus || 'Abierto',
      siguienteVerificacion: this.nuevoRiesgo.siguienteVerificacion,
      observaciones: this.nuevoRiesgo.observaciones || ''
    };

    this.riesgosService.createRiesgo(riesgoData)
      .subscribe({
        next: (response: Riesgo) => {
          console.log('✅ Riesgo guardado en H2:', response);
          this.listaRiesgos.push(response);
          this.limpiarFormularioRiesgo();
          this.messageService.add({
            severity: 'success',
            summary: 'Riesgo guardado',
            detail: 'El riesgo se ha guardado exitosamente en la base de datos H2'
          });
        },
        error: (error: any) => {
          console.error('❌ Error al guardar riesgo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el riesgo en la base de datos'
          });
        }
      });
  }

  /**
   * Elimina un riesgo de la lista
   */
  eliminarRiesgo(id: number) {
    if (!confirm('¿Estás seguro de eliminar este riesgo?')) {
      return;
    }

    this.riesgosService.eliminarRiesgo(id)
      .subscribe({
        next: () => {
          console.log('✅ Riesgo eliminado');
          this.listaRiesgos = this.listaRiesgos.filter(r => r.id !== id);
          alert('✅ Riesgo eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('❌ Error al eliminar riesgo:', error);
          alert('❌ Error al eliminar el riesgo');
        }
      });
  }

  /**
   * Limpia el formulario de nuevo riesgo
   */
  limpiarFormularioRiesgo() {
    this.nuevoRiesgo = {
      tipo: '',
      idDelProyecto: this.proyectoId,
      categoria: '',
      descripcionDelRiesgo: '',
      consecuencia: '',
      identificadoPor: '',
      nivelDeImpactoTotal: '',
      probabilidadDeOcurrencia: '',
      evaluacionDeRiesgos: '',
      estrategiaDelRiesgo: '',
      respuestaAlRiesgo: '',
      responsable: '',
      fechaLimite: new Date().toISOString().split('T')[0],
      estatus: 'Abierto',
      siguienteVerificacion: new Date().toISOString().split('T')[0],
      observaciones: ''
    };
  }

  /**
   * Guarda todos los riesgos de la tabla al backend
   */
  guardarTodosRiesgos() {
    console.log('🚀 ======= MÉTODO GUARDAR TODO LLAMADO =======');
    console.log('🔍 DEBUG: Contenido de this.risks:', this.risks);
    console.log('🔍 DEBUG: proyectoId:', this.proyectoId);
    console.log('🔍 DEBUG: Cantidad de riesgos:', this.risks.length);
    
    if (!this.proyectoId) {
      console.log('⚠️ ALERTA: No hay proyectoId');
      alert('⚠️ ERROR: No hay proyecto cargado. Ve a la página de Riesgos primero y crea un proyecto.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Proyecto requerido',
        detail: 'No hay proyecto cargado. Ve a /riesgos y crea un proyecto primero.'
      });
      return;
    }

    console.log('✅ Proyecto cargado correctamente, proyecto ID:', this.proyectoId);

    // FILTRA Y LIMPIA LOS DATOS ANTES DE ENVIAR
    const riesgosLimpios = this.risks
      .filter(risk => 
        risk.categoria && risk.categoria.trim() !== '' && 
        risk.descripcion && risk.descripcion.trim() !== ''
      )
      .map(risk => ({
        tipo: risk.tipo || 'Técnico',
        idDelProyecto: this.proyectoId,
        categoria: risk.categoria,
        descripcionDelRiesgo: risk.descripcion,
        consecuencia: risk.consecuencia || 'Sin especificar',
        identificadoPor: risk.identificadoPor || 'Usuario',
        nivelDeImpactoTotal: risk.nivelImpactoTotal || 'Medio',
        probabilidadDeOcurrencia: risk.probabilidadOcurrencia || 'Media',
        evaluacionDeRiesgos: risk.evaluacionRiesgo || 'En evaluación',
        estrategiaDelRiesgo: risk.estrategiaRiesgo || 'Mitigar',
        respuestaAlRiesgo: risk.respuestaRiesgo || 'Pendiente',
        responsable: risk.responsable || 'Sin asignar',
        // Arregla las fechas al formato ISO que Spring entiende
        fechaLimite: this.convertirFecha(risk.fechaLimite),
        // Arregla el estatus (lo más común que falla)
        estatus: risk.estatus === '-' || !risk.estatus ? 'Abierto' : risk.estatus,
        siguienteVerificacion: risk.siguienteVerificacion ? this.convertirFecha(risk.siguienteVerificacion) : undefined,
        observaciones: risk.observaciones || ''
      } as Riesgo));

    console.log('🔍 DEBUG: Después del filtrado, riesgosLimpios:', riesgosLimpios);
    console.log('🔍 DEBUG: Cantidad de riesgos limpios:', riesgosLimpios.length);

    if (riesgosLimpios.length === 0) {
      console.log('⚠️ ALERTA: No hay riesgos válidos para guardar');
      alert('⚠️ ATENCIÓN: No hay riesgos válidos. Necesitas llenar al menos Categoría y Descripción en la tabla.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin datos válidos',
        detail: 'No hay riesgos válidos para guardar. Llena al menos Categoría y Descripción.'
      });
      return;
    }

    let guardados = 0;
    let errores = 0;

    console.log(`� Guardando ${riesgosLimpios.length} riesgos...`);

    // Guardar cada riesgo válido
    riesgosLimpios.forEach((riesgoRequest, index) => {
      console.log(`🔍 Enviando riesgo ${index + 1}:`, JSON.stringify(riesgoRequest, null, 2));

      this.riesgosService.createRiesgo(riesgoRequest)
        .subscribe({
          next: (response: Riesgo) => {
            guardados++;
            console.log(`✅ Riesgo ${index + 1} guardado en H2:`, response);
            
            // Si es el último riesgo, mostrar resumen
            if (guardados + errores === riesgosLimpios.length) {
              this.messageService.add({
                severity: 'success',
                summary: 'Guardado completado',
                detail: `${guardados} riesgos guardados exitosamente. ${errores} errores`
              });
              this.cargarRiesgos(); // Recargar los datos
            }
          },
          error: (error: any) => {
            errores++;
            console.error(`❌ Error guardando riesgo ${index + 1}:`, error);
            console.error('📋 Detalle del error:', error.error);
            
            // Si es el último riesgo, mostrar resumen
            if (guardados + errores === riesgosLimpios.length) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Guardado con errores',
                detail: `${guardados} riesgos guardados. ${errores} errores`
              });
              this.cargarRiesgos(); // Recargar los datos
            }
          }
        });
    });
  }

  // ========== MÉTODOS AUXILIARES ==========
  
  /**
   * Formatea fecha ISO a formato legible (DD/MM/YYYY)
   */
  formatearFecha(fechaISO: string): string {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    return formatDate(fecha, 'dd/MM/yyyy HH:mm', 'en-US');
  }

  /**
   * Formatea fecha para mostrar en la tabla (DD/MM/YYYY)
   */
  formatearFechaTabla(fechaISO: string | null): string {
    if (!fechaISO) return '-';
    const fecha = new Date(fechaISO);
    return formatDate(fecha, 'dd/MM/yyyy', 'en-US');
  }

  /**
   * Obtiene el color según el nivel de impacto
   */
  getColorImpacto(nivel: string): string {
    switch (nivel) {
      case 'Crítico': return '#dc3545';
      case 'Alto': return '#fd7e14';
      case 'Medio': return '#ffc107';
      case 'Bajo': return '#28a745';
      default: return '#6c757d';
    }
  }

  /**
   * Obtiene el color según el estado
   */
  getColorEstado(estado: string): string {
    switch (estado) {
      case 'Identificado': return '#6c757d';
      case 'En Análisis': return '#0dcaf0';
      case 'En Tratamiento': return '#ffc107';
      case 'Mitigado': return '#0d6efd';
      case 'Cerrado': return '#28a745';
      default: return '#6c757d';
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
      consecuencia: '',
      identificadoPor: '',
      fechaRegistro: '',
      nivelImpactoTotal: '',
      probabilidadOcurrencia: '',
      evaluacionRiesgo: '',
      estrategiaRiesgo: '',
      respuestaRiesgo: '',
      responsable: '',
      fechaLimite: '',
      estatus: '',
      siguienteVerificacion: '',
      observaciones: ''
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
        'ID del Proyecto': risk.idProyecto,
        'Categoría': risk.categoria,
        'Descripción del Riesgo': risk.descripcion,
        'Consecuencia': risk.consecuencia,
        'Identificado por': risk.identificadoPor,
        'Fecha de Registro': risk.fechaRegistro,
        'Nivel de Impacto Total': risk.nivelImpactoTotal,
        'Probabilidad de Ocurrencia': risk.probabilidadOcurrencia,
        'Evaluación de Riesgos': risk.evaluacionRiesgo,
        'Estrategia del Riesgo': risk.estrategiaRiesgo,
        'Respuesta al Riesgo': risk.respuestaRiesgo,
        'Responsable': risk.responsable,
        'Fecha Límite': risk.fechaLimite,
        'Estatus': risk.estatus,
        'Siguiente Verificación': risk.siguienteVerificacion,
        'Observaciones': risk.observaciones
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
            'ID', 'Tipo', 'ID Proy.', 'Categoría', 'Descripción', 'Consecuencia',
            'Identificado por', 'F. Registro', 'Impacto Total', 'Prob. Ocurr.',
            'Evaluación', 'Estrategia', 'Respuesta', 'Responsable',
            'F. Límite', 'Estatus', 'Verificación', 'Observaciones'
          ]],
          body: this.risks.map(risk => [
            risk.id, risk.tipo, risk.idProyecto, risk.categoria, risk.descripcion,
            risk.consecuencia, risk.identificadoPor, risk.fechaRegistro,
            risk.nivelImpactoTotal, risk.probabilidadOcurrencia, risk.evaluacionRiesgo,
            risk.estrategiaRiesgo, risk.respuestaRiesgo, risk.responsable,
            risk.fechaLimite, risk.estatus, risk.siguienteVerificacion, risk.observaciones
          ]),
          theme: 'grid',
          styles: { fontSize: 5 },
          headStyles: { fillColor: [30, 58, 95], fontSize: 6 }
        });
        
        doc.save('Matriz_Riesgos_Oportunidades.pdf');
      });
    });
  }

  saveData() {
    console.log('Guardando datos de riesgos:', this.risks);
    alert('✅ Datos guardados correctamente');
  }

  /**
   * Convierte fecha de formato dd/MM/yyyy a yyyy-MM-dd (formato ISO para Spring)
   */
  convertirFecha(fecha: string): string | undefined {
    if (!fecha || fecha === '-' || fecha.trim() === '') return undefined;
    
    // Si ya está en formato ISO (yyyy-MM-dd), retornar tal cual
    if (fecha.includes('-') && fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fecha;
    }
    
    // Convertir de dd/MM/yyyy a yyyy-MM-dd
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    }
    
    return undefined;
  }
}
