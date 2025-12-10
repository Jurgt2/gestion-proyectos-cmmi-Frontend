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
import { ProyectosService } from '../services/proyectos.service';
import { RiskMatrix as RiskMatrixModel, ControlCambio } from '../models/risk-matrix.model';
import { Riesgo } from '../models/riesgo.model';

@Component({
  selector: 'app-risk-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './risk-matrix.html',
  styleUrls: ['./risk-matrix.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RiskMatrix implements OnInit {
  matrixData: any = {
    nombreProyecto: '',
    claveProyecto: '',
    fechaCreacion: '',
    ultimaActualizacion: '',
    totalRiesgos: 0,
    criticos: 0,
    mitigados: 0,
    cambiosRecientes: 0,
    proyecto: '',
    clave: '',
    responsable: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    controlCambios: []
  };
  currentMatrixId?: number;
  isSaving: boolean = false;
  saveMessage: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  // Variables para gestión de riesgos
  riesgos: Riesgo[] = [];
  nuevoRiesgo: Riesgo = this.inicializarRiesgo();
  modoEdicionRiesgo: boolean = false;
  riesgoSeleccionado?: Riesgo;

  constructor(
  private riskMatrixService: RiskMatrixService,
  private messageService: MessageService,
  private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    // Inicializar con valores vacíos para permitir crear nuevos proyectos
    this.matrixData = {
      nombreProyecto: '',
      claveProyecto: '',
      fechaCreacion: '',
      ultimaActualizacion: '',
      totalRiesgos: 0,
      criticos: 0,
      mitigados: 0,
      cambiosRecientes: 0,
      proyecto: '',
      clave: '',
      responsable: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      controlCambios: []
    };
    this.nuevoRiesgo = this.inicializarRiesgo();
    
    // COMENTADO: No cargar automáticamente el último proyecto
    // Si quieres cargar el último proyecto, descomenta la siguiente línea
    // this.loadLatestMatrix();
    
    this.cargarRiesgos();
    this.cargarCambios();
    
    console.log('📝 Formulario inicializado vacío. Listo para crear nuevo proyecto.');
  }

  loadLatestMatrix(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // NO establecer matrixData como null para evitar errores de renderizado
    this.riskMatrixService.getLatestMatrix().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data && data.id) {
          this.matrixData = {
            ...this.matrixData,
            ...data
          };
          this.currentMatrixId = data.id;
          this.saveMessage = '';
          console.log('✅ Matriz cargada desde H2:', this.matrixData);
        } else {
          // No existe matriz, mantener valores por defecto
          console.log('ℹ️ No hay matriz existente, usando valores por defecto');
          this.currentMatrixId = undefined;
          this.saveMessage = '';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.warn('⚠️ No se pudo cargar matriz (posiblemente no existe):', error);
        // Mantener matrixData con valores por defecto, no establecer null
        this.currentMatrixId = undefined;
      }
    });
  }

  saveMatrix(): void {
    console.log('🔵 Iniciando guardado de matriz...');
    console.log('📊 Datos a guardar:', this.matrixData);
    
    this.isSaving = true;
    
    // Actualizar la fecha de última actualización automáticamente
    const today = new Date().toISOString().split('T')[0];
    this.matrixData.ultimaActualizacion = today;
    
    // Si no hay fecha de creación, establecerla ahora
    if (!this.matrixData.fechaCreacion) {
      this.matrixData.fechaCreacion = today;
    }
    
    console.log('🆔 Current Matrix ID:', this.currentMatrixId);
    console.log('📅 Fecha actualización:', this.matrixData.ultimaActualizacion);
    console.log('📅 Fecha creación:', this.matrixData.fechaCreacion);
    
    if (this.currentMatrixId) {
      console.log('♻️ Actualizando matriz existente con ID:', this.currentMatrixId);
      this.riskMatrixService.updateMatrix(this.currentMatrixId, this.matrixData).subscribe({
        next: (data) => {
          this.isSaving = false;
          this.matrixData = data;
          console.log('✅ Matriz actualizada exitosamente:', data);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: '¡Matriz actualizada correctamente en la tabla "proyectos" de H2!',
            life: 3000
          });
        },
        error: (error) => {
          this.isSaving = false;
          console.error('❌ Error al actualizar:', error);
          console.error('📄 Detalles del error:', JSON.stringify(error, null, 2));
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al actualizar: ${error.message || 'Backend no disponible'}`,
            life: 5000
          });
        }
      });
    } else {
      console.log('➕ Creando nueva matriz...');
      this.riskMatrixService.createMatrix(this.matrixData).subscribe({
        next: (data) => {
          this.isSaving = false;
          this.matrixData = data;
          this.currentMatrixId = data.id;
          console.log('✅ Matriz creada exitosamente con ID:', data.id);
          console.log('📊 Datos guardados:', data);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `¡Proyecto guardado en tabla "proyectos" con ID: ${data.id}!`,
            life: 3000
          });
        },
        error: (error) => {
          this.isSaving = false;
          console.error('❌ Error al crear matriz:', error);
          console.error('📄 Detalles del error:', JSON.stringify(error, null, 2));
          console.error('🔗 URL del API:', error.url);
          console.error('📊 Status:', error.status);
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Conexión',
            detail: `No se puede conectar al backend. ¿Está corriendo en puerto 8080?`,
            life: 5000
          });
        }
      });
    }
  }

  /**
   * 💾 Método específico para guardar solo el proyecto (nombre y clave)
   * Este método envía únicamente los datos básicos del proyecto al backend
   */
  guardarMatriz(): void {
    console.log('🔵 Iniciando guardado de proyecto (matriz)...');
    console.log('📋 Estado actual de matrixData:', JSON.stringify(this.matrixData, null, 2));
    console.log('📝 nombreProyecto:', this.matrixData.nombreProyecto);
    console.log('🔑 claveProyecto:', this.matrixData.claveProyecto);
    
    // 1. Validar que los campos obligatorios estén completos
    if (!this.matrixData.nombreProyecto || !this.matrixData.claveProyecto) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Incompletos',
        detail: 'Por favor completa el nombre y la clave del proyecto'
      });
      console.warn('⚠️ Validación fallida: campos vacíos');
      console.warn('⚠️ nombreProyecto vacío:', !this.matrixData.nombreProyecto);
      console.warn('⚠️ claveProyecto vacío:', !this.matrixData.claveProyecto);
      return;
    }

    this.isSaving = true;

    // 2. Convertir fechas a formato ISO si existen
    const convertirFecha = (fecha: string): string => {
      if (!fecha) return new Date().toISOString();
      // Si ya es fecha de input HTML (YYYY-MM-DD), convertir a ISO
      if (fecha.includes('-') && !fecha.includes('T')) {
        return new Date(fecha + 'T00:00:00').toISOString();
      }
      return fecha;
    };

    // 3. Verificar si ya existe un proyecto (actualizar) o crear uno nuevo
    if (this.currentMatrixId) {
      console.log('🔄 Actualizando proyecto existente con ID:', this.currentMatrixId);
      
      const proyectoActualizado = {
        nombreProyecto: this.matrixData.nombreProyecto,
        claveProyecto: this.matrixData.claveProyecto,
        fechaCreacion: convertirFecha(this.matrixData.fechaCreacion),
        ultimaActualizacion: new Date().toISOString()
      };

      console.log('📤 Datos a actualizar:', proyectoActualizado);

      this.proyectosService.updateProyecto(this.currentMatrixId, proyectoActualizado as any).subscribe({
        next: (response) => {
          this.isSaving = false;
          console.log('✅ Proyecto actualizado:', response);
          
          if (response && response.id) {
            this.currentMatrixId = response.id;
            this.matrixData.id = response.id;
          }

          this.messageService.add({ 
            severity: 'success', 
            summary: '✅ Proyecto Actualizado', 
            detail: `¡Proyecto "${this.matrixData.nombreProyecto}" actualizado en H2!`,
            life: 5000 
          });
        },
        error: (error) => {
          this.isSaving = false;
          console.error('❌ Error al actualizar proyecto:', error);
          const msg = error?.error?.message || error?.message || 'Error al actualizar el proyecto';
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error al Actualizar', 
            detail: msg,
            life: 5000 
          });
        }
      });
    } else {
      console.log('➕ Creando nuevo proyecto...');
      
      // Crear el objeto con fechas en formato ISO
      const proyectoData = {
        nombreProyecto: this.matrixData.nombreProyecto,
        claveProyecto: this.matrixData.claveProyecto,
        fechaCreacion: convertirFecha(this.matrixData.fechaCreacion),
        ultimaActualizacion: new Date().toISOString()
      };

      console.log('📤 Datos a enviar:', proyectoData);

      // Hacer la petición POST al backend
      this.proyectosService.createProyecto(proyectoData).subscribe({
        next: (response) => {
          this.isSaving = false;
          console.log('✅ Respuesta del backend:', response);
          
          // Guardar el ID del proyecto creado
          if (response && response.id) {
            this.currentMatrixId = response.id;
            this.matrixData.id = response.id;
            console.log('✅ Proyecto guardado con ID:', this.currentMatrixId);
            console.log('📝 Valores guardados:', {
              nombreProyecto: this.matrixData.nombreProyecto,
              claveProyecto: this.matrixData.claveProyecto
            });
          }

          const detailText = `¡Proyecto "${this.matrixData.nombreProyecto}" guardado en H2 con ID: ${response?.id}!`;
          this.messageService.add({ 
            severity: 'success', 
            summary: '✅ Proyecto Guardado', 
            detail: detailText, 
            life: 5000 
          });
        },
        error: (error) => {
          this.isSaving = false;
          console.error('❌ Error al guardar proyecto:', error);
          console.error('📄 Detalles completos:', JSON.stringify(error, null, 2));
          
          // Extraer mensaje de error del backend
          const backendMsg = error?.error?.message || error?.error || error?.message || 'Error desconocido';
          const msg = typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg);
          
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error al Guardar', 
            detail: `No se pudo guardar: ${msg}`,
            life: 5000 
          });
        }
      });
    }
  }

  /**
   * 🆕 Limpiar formulario para crear un nuevo proyecto
   */
  nuevoProyecto(): void {
    console.log('🆕 Creando nuevo proyecto - limpiando formulario');
    
    this.matrixData = {
      nombreProyecto: '',
      claveProyecto: '',
      fechaCreacion: '',
      ultimaActualizacion: '',
      totalRiesgos: 0,
      criticos: 0,
      mitigados: 0,
      cambiosRecientes: 0,
      proyecto: '',
      clave: '',
      responsable: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      controlCambios: []
    };
    
    this.currentMatrixId = undefined;
    this.saveMessage = '';
    
    this.messageService.add({
      severity: 'info',
      summary: 'Nuevo Proyecto',
      detail: 'Formulario limpio. Ingresa los datos del nuevo proyecto.',
      life: 3000
    });
  }

  /**
   * 📝 Detectar cambios en los inputs en tiempo real
   */
  onInputChange(): void {
    console.log('✏️ Usuario escribiendo:', {
      nombreProyecto: this.matrixData.nombreProyecto,
      claveProyecto: this.matrixData.claveProyecto
    });
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

  // ==================== MÉTODOS PARA CONTROL DE CAMBIOS ====================

  /**
   * 📋 Cargar todos los cambios desde el backend
   */
  cargarCambios(): void {
    this.riskMatrixService.obtenerCambios().subscribe({
      next: (cambios) => {
        this.matrixData.controlCambios = cambios;
        console.log('✅ Cambios cargados:', cambios);
      },
      error: (error) => {
        console.error('❌ Error al cargar cambios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cambios'
        });
      }
    });
  }

  /**
   * ➕ Agregar nueva fila de control de cambios
   */
  addControlCambio(): void {
    const nuevoCambio = {
      version: '',
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      descripcion: '',
      autor: '',
      aprobo: '',
      esNuevo: true // Marca para identificar filas nuevas sin guardar
    };
    
    this.matrixData.controlCambios.push(nuevoCambio);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Fila Agregada',
      detail: 'Complete los datos y haga clic en "Guardar Cambios"'
    });
  }

  /**
   * 💾 Guardar un cambio específico en el backend
   */
  guardarCambio(cambio: any, index: number): void {
    // Validar campos obligatorios
    if (!cambio.version || !cambio.descripcion || !cambio.autor) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Incompletos',
        detail: 'Por favor completa Versión, Descripción y Autor'
      });
      return;
    }

    // Convertir fecha a formato ISO completo
    const fechaISO = this.convertirFechaAISO(cambio.fecha);

    const cambioData = {
      version: cambio.version,
      fecha: fechaISO,
      descripcion: cambio.descripcion,
      autor: cambio.autor,
      aprobo: cambio.aprobo || '',
      riesgoId: this.currentMatrixId || undefined
    };

    if (cambio.id) {
      // Actualizar cambio existente
      this.riskMatrixService.actualizarCambio(cambio.id, cambioData).subscribe({
        next: (response) => {
          this.matrixData.controlCambios[index] = response;
          this.messageService.add({
            severity: 'success',
            summary: 'Cambio Actualizado',
            detail: 'El cambio se actualizó correctamente'
          });
        },
        error: (error) => {
          console.error('❌ Error al actualizar cambio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el cambio'
          });
        }
      });
    } else {
      // Crear nuevo cambio
      this.riskMatrixService.crearCambio(cambioData).subscribe({
        next: (response) => {
          this.matrixData.controlCambios[index] = response;
          delete this.matrixData.controlCambios[index].esNuevo;
          this.messageService.add({
            severity: 'success',
            summary: 'Cambio Guardado',
            detail: `Cambio guardado con ID: ${response.id}`
          });
        },
        error: (error) => {
          console.error('❌ Error al guardar cambio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el cambio'
          });
        }
      });
    }
  }

  /**
   * 🗑️ Eliminar un cambio
   */
  deleteControlCambio(index: number): void {
    const cambio = this.matrixData.controlCambios[index];
    
    if (!cambio.id) {
      // Si no tiene ID, solo quitarlo del array (no está guardado)
      this.matrixData.controlCambios.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Fila Eliminada',
        detail: 'Fila eliminada localmente'
      });
      return;
    }

    // Confirmar eliminación
    if (!confirm('¿Estás seguro de eliminar este cambio? Esta acción no se puede deshacer.')) {
      return;
    }

    // Eliminar del backend
    this.riskMatrixService.eliminarCambio(cambio.id).subscribe({
      next: () => {
        this.matrixData.controlCambios.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Cambio Eliminado',
          detail: 'El cambio se eliminó correctamente'
        });
      },
      error: (error) => {
        console.error('❌ Error al eliminar cambio:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cambio'
        });
      }
    });
  }

  /**
   * 💾 Guardar todos los cambios pendientes
   */
  guardarTodosCambios(): void {
    const cambiosPendientes = this.matrixData.controlCambios.filter((c: any) => c.esNuevo);
    
    if (cambiosPendientes.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin Cambios',
        detail: 'No hay cambios pendientes por guardar'
      });
      return;
    }

    let guardados = 0;
    let errores = 0;

    cambiosPendientes.forEach((cambio: any, idx: number) => {
      const index = this.matrixData.controlCambios.indexOf(cambio);
      this.guardarCambio(cambio, index);
      guardados++;
    });

    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Proceso Completo',
        detail: `Se procesaron ${guardados} cambios`
      });
    }, 1000);
  }

  /**
   * 📅 Convertir fecha a formato ISO para el backend
   */
  convertirFechaAISO(fecha: any): string {
    if (!fecha) {
      return new Date().toISOString();
    }
    
    if (typeof fecha === 'string') {
      // Si ya es una fecha en formato YYYY-MM-DD
      return new Date(fecha + 'T00:00:00').toISOString();
    }
    
    if (fecha instanceof Date) {
      return fecha.toISOString();
    }
    
    return new Date().toISOString();
  }

  /**
   * 📅 Formatear fecha ISO a formato legible
   */
  formatearFecha(fechaISO: string): string {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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

  // ==================== MÉTODOS PARA GESTIÓN DE RIESGOS ====================

  inicializarRiesgo(): Riesgo {
    return {
      tipo: '',
      idDelProyecto: '1',
      categoria: '',
      descripcionDelRiesgo: '',
      consecuencia: '',
      identificadoPor: '',
      nivelDeImpactoTotal: 'Medio',
      probabilidadDeOcurrencia: 'Media',
      evaluacionDeRiesgos: '',
      estrategiaDelRiesgo: '',
      respuestaAlRiesgo: '',
      responsable: '',
      estatus: 'Abierto',
      fechaLimite: new Date().toISOString().split('T')[0],
      siguienteVerificacion: new Date().toISOString().split('T')[0],
      observaciones: ''
    };
  }

  cargarRiesgos(): void {
    // TODO: Implementar carga de riesgos compatible con risk-matrix
    console.log('cargarRiesgos() - Pendiente de implementación');
    this.actualizarEstadisticasRiesgos();
  }

  guardarRiesgo(): void {
    // Validar campos obligatorios
    if (!this.nuevoRiesgo.categoria || !this.nuevoRiesgo.descripcionDelRiesgo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Incompletos',
        detail: 'Por favor complete la categoría y descripción del riesgo'
      });
      return;
    }

    // Validar formato de fechas
    if (this.nuevoRiesgo.fechaLimite && !this.validarFormatoFecha(this.nuevoRiesgo.fechaLimite)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formato Incorrecto',
        detail: 'La fecha límite debe estar en formato YYYY-MM-DD'
      });
      return;
    }

    if (this.modoEdicionRiesgo && this.riesgoSeleccionado?.id) {
      this.actualizarRiesgo();
    } else {
      this.crearRiesgo();
    }
  }

  crearRiesgo(): void {
    // TODO: Implementar creación de riesgo compatible con risk-matrix
    console.log('crearRiesgo() - Pendiente de implementación');
    this.messageService.add({
      severity: 'info',
      summary: 'Función Deshabilitada',
      detail: 'La creación de riesgos está temporalmente deshabilitada'
    });
  }

  actualizarRiesgo(): void {
    // TODO: Implementar actualización de riesgo compatible con risk-matrix
    console.log('actualizarRiesgo() - Pendiente de implementación');
    this.messageService.add({
      severity: 'info',
      summary: 'Función Deshabilitada',
      detail: 'La actualización de riesgos está temporalmente deshabilitada'
    });
  }

  eliminarRiesgo(id: number): void {
    // TODO: Implementar eliminación de riesgo compatible con risk-matrix
    console.log('eliminarRiesgo() - Pendiente de implementación');
    this.messageService.add({
      severity: 'info',
      summary: 'Función Deshabilitada',
      detail: 'La eliminación de riesgos está temporalmente deshabilitada'
    });
  }

  editarRiesgo(riesgo: Riesgo): void {
    this.modoEdicionRiesgo = true;
    this.riesgoSeleccionado = riesgo;
    this.nuevoRiesgo = { ...riesgo };
    
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicionRiesgo(): void {
    this.modoEdicionRiesgo = false;
    this.riesgoSeleccionado = undefined;
    this.nuevoRiesgo = this.inicializarRiesgo();
  }

  validarFormatoFecha(fecha: string): boolean {
    if (!fecha) return true; // Fecha vacía es válida (opcional)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(fecha);
  }

  actualizarEstadisticasRiesgos(): void {
    if (!this.matrixData) return;
    
    this.matrixData.totalRiesgos = this.riesgos.length;
    this.matrixData.criticos = this.riesgos.filter(r => 
      r.nivelDeImpactoTotal === 'Crítico' || r.nivelDeImpactoTotal === 'Alto'
    ).length;
    this.matrixData.mitigados = this.riesgos.filter(r => 
      r.estatus === 'Mitigado' || r.estatus === 'Cerrado'
    ).length;
    
    // Calcular cambios recientes (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    this.matrixData.cambiosRecientes = this.riesgos.filter(r => {
      if (!r.fechaDeRegistro) return false;
      const fechaRegistro = new Date(r.fechaDeRegistro);
      return fechaRegistro >= hace30Dias;
    }).length;
  }
}
