# 🚀 Sistema de Gestión de Proyectos CMMI - Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.0.0-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-18.0.1-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistema web empresarial para la gestión integral de proyectos bajo el modelo CMMI**

[🌐 Demo](#) • [📖 Documentación](#características) • [🐛 Reportar Bug](https://github.com/Jurgt2/gestion-proyectos-cmmi-Frontend/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Screenshots](#-screenshots)
- [Backend](#-backend)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## 🎯 Descripción

Sistema web full-stack desarrollado con **Angular 20** para la gestión integral de proyectos empresariales basado en el modelo **CMMI (Capability Maturity Model Integration)**. 

El sistema permite:
- ✅ Administrar portafolios de proyectos
- ✅ Identificar y evaluar riesgos
- ✅ Generar matriz de riesgos y oportunidades
- ✅ Crear reportes ejecutivos en Excel y PDF
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sistema de autenticación y seguridad

---

## ✨ Características

### 🔐 **Autenticación y Seguridad**
- Sistema de login con validación de usuarios
- Guards de ruta para protección de componentes
- Gestión de sesiones
- Redirección automática según permisos

### 📊 **Gestión de Proyectos**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Registro detallado de proyectos empresariales
- Almacenamiento persistente en base de datos
- Validación de formularios en tiempo real

### ⚠️ **Matriz de Riesgos y Oportunidades**
- Identificación de riesgos técnicos, operativos y estratégicos
- Evaluación de impacto y probabilidad de ocurrencia
- Clasificación por categorías:
  - Alcance
  - Costo
  - Infraestructura
  - Calidad
  - Recursos Humanos
  - Y más...
- Asignación de responsables y seguimiento de estatus
- Estrategias de mitigación y respuesta
- Fechas límite y verificaciones

### 📈 **Dashboard de Control**
- Visualización de estadísticas en tiempo real
- Análisis de riesgos por nivel de impacto
- Filtros avanzados:
  - Por tipo de riesgo
  - Por categoría
  - Por estatus
  - Por responsable
  - Por nivel de impacto
  - Por probabilidad
- Indicadores de proyectos activos
- Gráficos y métricas

### 📄 **Generación de Reportes**
- Exportación a Excel (XLSX) con formato completo
- Generación de documentos PDF ejecutivos
- Reportes personalizables
- Descarga instantánea

### 🎨 **Interfaz de Usuario**
- Diseño responsivo (móvil, tablet, desktop)
- Componentes UI profesionales con PrimeNG
- Tablas dinámicas con edición inline
- Notificaciones toast para feedback
- Tema corporativo personalizable

---

## 🛠 Tecnologías

### **Core**
- **Angular 20.0.0** - Framework principal
- **TypeScript 5.6** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva
- **Zone.js 0.15** - Change detection

### **UI/UX**
- **PrimeNG 18.0.1** - Librería de componentes UI
- **PrimeFlex 3.3.1** - Utilidades CSS flexbox
- **PrimeIcons 7.0.0** - Sistema de iconos
- **SCSS** - Preprocesador CSS avanzado

### **Utilidades**
- **jsPDF 2.5.2** - Generación de PDFs
- **jsPDF-AutoTable 3.8.4** - Tablas en PDF
- **xlsx 0.18.5** - Exportación a Excel
- **File-Saver 2.0.5** - Descarga de archivos
- **Chart.js 4.4.8** - Gráficos y visualizaciones

### **Herramientas de Desarrollo**
- **Angular CLI 20.0.1** - Herramienta de línea de comandos
- **ESLint** - Linter de código
- **TypeScript Compiler** - Compilador TS
- **Webpack** - Module bundler (integrado en Angular)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### **1. Node.js** (Versión 18 o superior)
```bash
node --version
# Debe mostrar: v18.x.x o v20.x.x
```
📥 **Descargar:** https://nodejs.org/

### **2. npm** (Viene con Node.js)
```bash
npm --version
# Debe mostrar: 9.x.x o 10.x.x
```

### **3. Angular CLI** (Versión 20)
```bash
ng version
```
**Si no está instalado:**
```bash
npm install -g @angular/cli
```

---

## 🚀 Instalación

### **Paso 1: Clonar el repositorio**
```bash
git clone https://github.com/Jurgt2/gestion-proyectos-cmmi-Frontend.git
cd gestion-proyectos-cmmi-Frontend
```

### **Paso 2: Instalar dependencias**
```bash
npm install
```
⏱️ **Tiempo estimado:** 2-5 minutos

### **Paso 3: Configurar el backend**
Asegúrate de que el backend esté corriendo en:
```
http://localhost:8080
```

📌 **Ver repositorio del backend:** [gestion-proyectos-cmmi-Backend](https://github.com/Jurgt2/gestion-proyectos-cmmi-Backend)

---

## 💻 Uso

### **Iniciar el servidor de desarrollo**
```bash
ng serve
```

### **Con apertura automática del navegador**
```bash
ng serve --open
```

### **Con puerto personalizado**
```bash
ng serve --port 4201
```

### **Acceder a la aplicación**
```
http://localhost:4200
```

### **Compilar para producción**
```bash
ng build --configuration production
```
Los archivos compilados estarán en: `dist/sakai-ng/`

---

## 📁 Estructura del Proyecto

```
gestion-proyectos-cmmi-Frontend/
├── src/
│   ├── app/
│   │   ├── auth/                      # Módulo de autenticación
│   │   │   └── login/                 # Componente de login
│   │   ├── guards/                    # Guards de ruta
│   │   │   └── auth.guard.ts          # Protección de rutas
│   │   ├── layout/                    # Componentes de layout
│   │   │   ├── app.layout.ts          # Layout principal
│   │   │   ├── app.menu.ts            # Menú de navegación
│   │   │   ├── app.sidebar.ts         # Sidebar
│   │   │   └── app.topbar.ts          # Barra superior
│   │   ├── models/                    # Modelos TypeScript
│   │   │   ├── riesgo.model.ts        # Modelo de Riesgo
│   │   │   └── risk-matrix.model.ts   # Modelo de Matriz
│   │   ├── pages/                     # Páginas del sistema
│   │   │   ├── crud/                  # Gestión de proyectos
│   │   │   ├── usuarios/              # Gestión de usuarios
│   │   │   └── dashboard/             # Dashboard principal
│   │   ├── risk-identification/       # Identificación de riesgos
│   │   │   ├── risk-identification.ts
│   │   │   ├── risk-identification.html
│   │   │   └── risk-identification.scss
│   │   ├── risk-matrix/               # Matriz de riesgos
│   │   │   ├── risk-matrix.ts
│   │   │   ├── risk-matrix.html
│   │   │   └── risk-matrix.scss
│   │   ├── services/                  # Servicios Angular
│   │   │   ├── proyectos.service.ts   # Servicio de proyectos
│   │   │   ├── riesgos.service.ts     # Servicio de riesgos
│   │   │   └── risk-matrix.service.ts # Servicio de matriz
│   │   ├── app.config.ts              # Configuración de la app
│   │   └── app.routes.ts              # Rutas de la aplicación
│   ├── assets/                        # Archivos estáticos
│   │   ├── images/                    # Imágenes
│   │   ├── layout/                    # Estilos del layout
│   │   └── styles.scss                # Estilos globales
│   ├── environments/                  # Configuración de entornos
│   │   ├── environment.ts             # Desarrollo
│   │   └── environment.prod.ts        # Producción
│   └── index.html                     # HTML principal
├── angular.json                       # Configuración de Angular
├── package.json                       # Dependencias del proyecto
├── tsconfig.json                      # Configuración TypeScript
├── proxy.conf.json                    # Proxy para backend
├── COMO_INICIAR_FRONTEND.md          # Guía de inicio
└── README.md                          # Este archivo
```

---

## 📸 Screenshots

### 🔐 **Login**
Página de autenticación con validación de usuarios

### 📊 **Dashboard Principal**
Vista general con estadísticas y métricas del sistema

### 📋 **Gestión de Proyectos**
CRUD completo para administrar proyectos empresariales

### ⚠️ **Identificación de Riesgos**
Tabla dinámica para identificar y registrar riesgos

### 📈 **Matriz de Riesgos**
Análisis visual de riesgos por impacto y probabilidad

---

## 🔌 Backend

Este frontend se conecta con el backend Spring Boot:

**Repositorio:** [gestion-proyectos-cmmi-Backend](https://github.com/Jurgt2/gestion-proyectos-cmmi-Backend)

### **Tecnologías del Backend:**
- Spring Boot 2.7.18
- Java 17
- H2 Database
- Spring Data JPA
- Maven

### **Endpoints API:**
```
# Proyectos
GET    /api/proyectos
POST   /api/proyectos
GET    /api/proyectos/{id}
PUT    /api/proyectos/{id}
DELETE /api/proyectos/{id}

# Riesgos
GET    /api/riesgos
POST   /api/riesgos
GET    /api/riesgos/{id}
PUT    /api/riesgos/{id}
DELETE /api/riesgos/{id}
GET    /api/riesgos/proyecto/{idProyecto}
GET    /api/riesgos/tipo/{tipo}
GET    /api/riesgos/categoria/{categoria}
```

---

## 🛑 Comandos Útiles

### **Detener el servidor**
```bash
Ctrl + C
```

### **Limpiar caché de Angular**
```bash
ng cache clean
```

### **Reinstalar dependencias**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Ejecutar tests**
```bash
ng test
```

### **Verificar errores de linting**
```bash
ng lint
```

### **Generar componente**
```bash
ng generate component nombre-componente
```

### **Generar servicio**
```bash
ng generate service nombre-servicio
```

---

## 🐛 Solución de Problemas

### ❌ **Error: "ng: command not found"**
```bash
npm install -g @angular/cli
```

### ❌ **Error: "Port 4200 is already in use"**
```bash
# Opción 1: Matar el proceso
lsof -ti:4200 | xargs kill -9

# Opción 2: Usar otro puerto
ng serve --port 4201
```

### ❌ **Error: "Cannot find module '@angular/...'"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ **Error de conexión con backend**
Verificar que el backend esté corriendo:
```bash
curl http://localhost:8080/api/proyectos
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Jorge Curioso**

- GitHub: [@Jurgt2](https://github.com/Jurgt2)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)

---

## 🌟 Agradecimientos

- **Angular Team** - Por el excelente framework
- **PrimeNG Team** - Por los componentes UI profesionales
- **Spring Boot** - Por facilitar el desarrollo del backend

---

## 📊 Estado del Proyecto

### ✅ **Completado:**
- ✅ Autenticación y login
- ✅ Gestión de proyectos (CRUD)
- ✅ Identificación de riesgos
- ✅ Matriz de riesgos
- ✅ Dashboard con estadísticas
- ✅ Exportación Excel/PDF
- ✅ Guards de seguridad
- ✅ Conexión con backend
- ✅ Diseño responsivo

### 🔄 **En Desarrollo:**
- 🔄 Tests unitarios
- 🔄 Tests E2E
- 🔄 Documentación API
- 🔄 Modo offline

### 📋 **Próximas Mejoras:**
- 📋 Notificaciones push
- 📋 Exportación a Word
- 📋 Gráficos avanzados
- 📋 Modo oscuro
- 📋 Múltiples idiomas

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ por [Jorge Curioso](https://github.com/Jurgt2)

</div>
