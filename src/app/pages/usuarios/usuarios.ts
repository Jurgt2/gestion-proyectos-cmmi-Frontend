import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
  ToastModule
  ]
})
export class UsuariosComponent {
  usuarios: any[] = [];
  usuarioForm: FormGroup;
  loading = false;
  submitted = false;
  isAdmin = false; // TODO: set from auth context

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required]
    });
    this.loadUsuarios();
  }
  
  exportarExcel() {
    const data = this.usuarios.map(u => ({
      Nombre: u.name,
      Email: u.email,
      Rol: u.rol
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Usuarios': worksheet }, SheetNames: ['Usuarios'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'usuarios.xlsx');
  }
  
  exportarPDF() {
    const doc = new jsPDF();
    doc.text('Gestión de Usuarios', 14, 15);
    autoTable(doc, {
      head: [['Nombre', 'Email', 'Rol']],
      body: this.usuarios.map(u => [u.name, u.email, u.rol]),
      startY: 20
    });
    doc.save('usuarios.pdf');
  }

  loadUsuarios() {
    this.loading = true;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudieron cargar los usuarios'});
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.usuarioForm.invalid) return;
    const email = this.usuarioForm.value.email;
    if (this.usuarios.some(u => u.email === email)) {
      this.messageService.add({severity:'warn', summary:'Email duplicado', detail:'El email ya existe'});
      return;
    }
    this.loading = true;
    this.usuarioService.createUsuario(this.usuarioForm.value).subscribe({
      next: (usuario: any) => {
        this.usuarios.push(usuario);
        this.messageService.add({severity:'success', summary:'Usuario creado', detail:'El usuario fue creado correctamente'});
        this.usuarioForm.reset();
        this.submitted = false;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo crear el usuario'});
        this.loading = false;
      }
    });
  }

  deleteUsuario(usuario: any) {
    if (!this.isAdmin) {
      this.messageService.add({severity:'warn', summary:'Acceso denegado', detail:'Solo los administradores pueden eliminar usuarios'});
      return;
    }
    this.loading = true;
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u: any) => u.id !== usuario.id);
        this.messageService.add({severity:'success', summary:'Usuario eliminado', detail:'El usuario fue eliminado correctamente'});
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo eliminar el usuario'});
        this.loading = false;
      }
    });
  }
}
