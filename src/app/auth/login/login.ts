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
  name: string = '';
  email: string = '';
  password: string = '';
  mensaje: string = '';
  cargando: boolean = false;
  usuarios: any[] = [];
  agreeTerms: boolean = false;

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
          // Guardar token en localStorage
          if (response.user) {
            console.log('Usuario autenticado:', response.user);
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
    if (!this.name || !this.email || !this.password) {
      this.mensaje = '⚠️ Por favor completa todos los campos';
      return;
    }

    if (!this.agreeTerms) {
      this.mensaje = '⚠️ Debes aceptar los términos y condiciones';
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

  loginWithGoogle() {
    this.mensaje = 'Iniciando sesión con Google...';
    // Implementar OAuth de Google aquí
    console.log('Login con Google');
  }

  loginWithApple() {
    this.mensaje = 'Iniciando sesión con Apple...';
    // Implementar OAuth de Apple aquí
    console.log('Login con Apple');
  }

  goToSignIn() {
    this.mensaje = 'Redirigiendo a inicio de sesión...';
    // Navegar a la página de login si esta es signup
    console.log('Ir a Sign In');
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
