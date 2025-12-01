import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, LoginResponse } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  mensaje: string = '';
  cargando: boolean = false;
  usuarios: any[] = [];
  rememberMe: boolean = false;

  showRiskMatrix: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    // No ejecutar test automático si prefieres no golpear el backend al inicio
    // this.testBackend();
  }

  toggleRiskMatrix() {
    this.showRiskMatrix = !this.showRiskMatrix;
  }

  testBackend() {
    console.log('Probando conexión con el backend...');
    this.usuarioService.testConnection().subscribe({
      next: (response) => {
        console.log('✅ Conexión exitosa:', response);
  this.mensaje = '✅ Conexión con el backend exitosa: ' + response;
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
  this.mensaje = '❌ Error de conexión: ' + (error?.message || error);
      }
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.mensaje = '⚠️ Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.mensaje = 'Iniciando sesión...';

    this.usuarioService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.cargando = false;
        console.log('Respuesta login:', response);

        if (response.success) {
          this.mensaje = '✅ Inicio de sesión correcto';
          // si no guardas en localStorage por defecto, usar rememberMe
          if (this.rememberMe && response.user) {
            // ya el servicio guarda token si backend lo retorna
            console.log('Guardando sesión persistente (rememberMe)');
          }
        } else {
          this.mensaje = '❌ Error: ' + response.mensaje;
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error login:', error);
        this.mensaje = '❌ Error de conexión: ' + (error?.message || error);
      }
    });
  }

  register() {
    if (!this.email || !this.password) {
      this.mensaje = '⚠️ Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.mensaje = 'Registrando usuario...';

    this.usuarioService.register(this.email, this.password).subscribe({
      next: (response) => {
        this.cargando = false;
        console.log('Respuesta registro:', response);
        this.mensaje = '✅ Usuario registrado exitosamente';
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error registro:', error);
        this.mensaje = '❌ Error al registrar: ' + (error?.message || error);
      }
    });
  }

  forgotPassword() {
    this.mensaje = 'Redirigiendo a recuperación de contraseña...';
    // Aquí puedes navegar a /auth/forgot-password si existe la ruta
    // this.router.navigate(['/auth/forgot-password']);
  }

  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('Usuarios obtenidos:', usuarios);
        this.mensaje = `✅ ${usuarios.length} usuarios encontrados`;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.mensaje = '❌ Error al obtener usuarios: ' + (error?.message || error);
      }
    });
  }
}
