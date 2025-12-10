# 🚀 CÓMO INICIAR EL FRONTEND - Sistema CMMI

## 📋 Requisitos Previos

Antes de poder iniciar el frontend, necesitas tener instalado:

### 1️⃣ **Node.js** (Versión 18 o superior)
```bash
# Verificar si tienes Node.js instalado:
node --version

# Debería mostrar algo como: v18.x.x o v20.x.x
```

**Si no lo tienes instalado:**
- Descarga desde: https://nodejs.org/
- Instala la versión LTS (Long Term Support)

---

### 2️⃣ **npm** (Node Package Manager)
```bash
# Verificar si tienes npm instalado:
npm --version

# Debería mostrar algo como: 9.x.x o 10.x.x
```

**Nota:** npm se instala automáticamente con Node.js

---

### 3️⃣ **Angular CLI** (Versión 20 o compatible)
```bash
# Verificar si tienes Angular CLI instalado:
ng version

# Debería mostrar Angular CLI: 20.x.x
```

**Si no lo tienes instalado:**
```bash
npm install -g @angular/cli
```

---

## 📦 Instalación de Dependencias

### Paso 1: Ubicarte en la carpeta del proyecto
```bash
cd /Users/jorgeynoelcurioso/Desktop/ProyectosAngular/gestion-proyectos-cmmi
```

### Paso 2: Instalar todas las dependencias
```bash
npm install
```

**Esto instalará:**
- Angular 20
- PrimeNG (componentes UI)
- PrimeIcons
- RxJS
- TypeScript
- Y todas las demás dependencias necesarias

**Tiempo estimado:** 2-5 minutos (dependiendo de tu conexión)

---

## 🎯 Iniciar el Frontend

### Opción 1: Comando Básico
```bash
ng serve
```

### Opción 2: Comando con Puerto Específico
```bash
ng serve --port 4200
```

### Opción 3: Comando con Apertura Automática del Navegador
```bash
ng serve --open
```

### Opción 4: Comando Completo (Recomendado)
```bash
ng serve --port 4200 --open
```

---

## ✅ Verificar que Funciona

### 1. **Espera a que compile**
Deberías ver algo como:
```
✔ Browser application bundle generation complete.
✔ Built at: 2025-12-10T00:00:00.000Z

Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
➜  Local:   http://localhost:4200/
➜  press h + enter to show help
```

### 2. **Abre tu navegador**
```
http://localhost:4200
```

### 3. **Verifica que carga el login**
Deberías ver la página de inicio de sesión del sistema CMMI

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "ng: command not found"
**Problema:** Angular CLI no está instalado
**Solución:**
```bash
npm install -g @angular/cli
```

---

### ❌ Error: "Port 4200 is already in use"
**Problema:** El puerto 4200 ya está siendo usado
**Solución 1:** Mata el proceso en el puerto 4200
```bash
lsof -ti:4200 | xargs kill -9
```

**Solución 2:** Usa otro puerto
```bash
ng serve --port 4201
```

---

### ❌ Error: "Cannot find module '@angular/...'"
**Problema:** Faltan dependencias
**Solución:** Reinstala las dependencias
```bash
rm -rf node_modules
npm install
```

---

### ❌ Error: "This version of CLI is only compatible with Angular versions..."
**Problema:** Incompatibilidad de versiones
**Solución:** Actualiza Angular CLI
```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

---

### ❌ Error de compilación de TypeScript
**Problema:** Errores en el código TypeScript
**Solución:** Revisa la consola para ver qué archivo tiene el error
```bash
# Los errores se muestran en la terminal con el archivo y línea exacta
```

---

## 🛑 Detener el Frontend

### Método 1: En la terminal donde está corriendo
```bash
Ctrl + C
```

### Método 2: Matar el proceso manualmente
```bash
pkill -f "ng serve"
```

### Método 3: Matar por puerto
```bash
lsof -ti:4200 | xargs kill -9
```

---

## 📁 Estructura del Proyecto Frontend

```
gestion-proyectos-cmmi/
├── src/
│   ├── app/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── layout/            # Componentes de layout
│   │   ├── pages/             # Páginas del sistema
│   │   ├── risk-identification/  # Identificación de riesgos
│   │   ├── risk-matrix/       # Matriz de riesgos
│   │   ├── services/          # Servicios Angular
│   │   ├── models/            # Modelos TypeScript
│   │   └── guards/            # Guards de seguridad
│   ├── assets/                # Archivos estáticos
│   ├── environments/          # Configuración de entornos
│   └── index.html             # HTML principal
├── angular.json               # Configuración de Angular
├── package.json               # Dependencias del proyecto
├── tsconfig.json              # Configuración TypeScript
└── proxy.conf.json            # Configuración de proxy para backend
```

---

## 🌐 URLs Importantes

### Frontend:
```
http://localhost:4200
```

### Páginas principales:
- **Login:** `http://localhost:4200/auth/login`
- **Proyectos:** `http://localhost:4200/riesgos`
- **Identificación Riesgos:** `http://localhost:4200/identification-riesgos`
- **Matriz Riesgos:** `http://localhost:4200/risk-matrix`

---

## 🔄 Backend Requerido

**⚠️ IMPORTANTE:** El frontend necesita que el backend esté corriendo para funcionar correctamente.

### Verificar si el backend está corriendo:
```bash
curl http://localhost:8080/api/proyectos
```

### Si el backend NO está corriendo:
Ver el archivo: **COMO_INICIAR_BACKEND.md**

---

## 📝 Comandos Útiles

### Compilar el proyecto (sin servidor):
```bash
ng build
```

### Ejecutar tests:
```bash
ng test
```

### Verificar errores de linting:
```bash
ng lint
```

### Generar un componente nuevo:
```bash
ng generate component nombre-componente
```

### Generar un servicio nuevo:
```bash
ng generate service nombre-servicio
```

---

## 🎨 Tecnologías Usadas en el Frontend

- **Angular 20:** Framework principal
- **TypeScript:** Lenguaje de programación
- **PrimeNG:** Librería de componentes UI
- **PrimeIcons:** Iconos
- **RxJS:** Programación reactiva
- **SCSS:** Estilos CSS avanzados
- **jsPDF:** Generación de PDFs
- **xlsx:** Exportación a Excel

---

## 📊 Estado del Proyecto

### ✅ Componentes Funcionando:
- ✅ Login y autenticación
- ✅ Gestión de proyectos
- ✅ Identificación de riesgos
- ✅ Matriz de riesgos
- ✅ Dashboard con estadísticas
- ✅ Exportación Excel/PDF
- ✅ Guards de seguridad en rutas

### 🔗 Conexión con Backend:
- ✅ API de Proyectos conectada
- ✅ API de Riesgos conectada
- ✅ Proxy configurado correctamente

---

## 🆘 Ayuda Adicional

### Si algo no funciona:

1. **Verifica que Node.js esté instalado:**
   ```bash
   node --version
   ```

2. **Verifica que Angular CLI esté instalado:**
   ```bash
   ng version
   ```

3. **Reinstala dependencias:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Limpia caché de npm:**
   ```bash
   npm cache clean --force
   ```

5. **Reinicia tu computadora** (a veces ayuda 😅)

---

## 📞 Comandos Rápidos (Cheat Sheet)

```bash
# Instalar dependencias
npm install

# Iniciar frontend
ng serve

# Iniciar frontend en modo desarrollo con apertura de navegador
ng serve --open

# Detener frontend
Ctrl + C

# Matar proceso en puerto 4200
lsof -ti:4200 | xargs kill -9

# Ver logs en tiempo real
tail -f frontend.log

# Compilar para producción
ng build --configuration production
```

---

## ✨ Tips Pro

### 1. **Modo Watch (Auto-reload):**
El comando `ng serve` ya tiene auto-reload activado por defecto. Cualquier cambio en el código se recarga automáticamente en el navegador.

### 2. **Ver detalles de compilación:**
```bash
ng serve --verbose
```

### 3. **Optimización para desarrollo:**
```bash
ng serve --optimization=false --source-map=true
```

### 4. **Ver en otros dispositivos de tu red local:**
```bash
ng serve --host 0.0.0.0
# Luego accede desde otro dispositivo: http://TU_IP:4200
```

---

## 📅 Última Actualización
**Fecha:** 10 de Diciembre de 2025
**Versión Angular:** 20.0.0
**Estado:** ✅ Funcionando correctamente

---

**¡Listo! Con esto ya puedes iniciar tu frontend sin problemas. 🚀**

Si tienes dudas, revisa los archivos:
- `DESCRIPCION_PARA_CV.md` - Información del proyecto
- `COMO_INICIAR_BACKEND.md` - Para iniciar el backend
- `RESUMEN_CONEXION_RIESGOS.md` - Sobre la conexión frontend-backend
