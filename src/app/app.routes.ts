import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
  { 
    path: 'auth/login', 
    loadComponent: () => import('./auth/login/login').then(m => m.Login)
  },
  { 
    path: 'auth/riesgos', 
    loadComponent: () => import('./risk-matrix/risk-matrix').then(m => m.RiskMatrix)
  },
  
  // Matriz de Riesgos - Acceso directo (sin layout)
  {
    path: 'riesgos',
    loadComponent: () => import('./risk-matrix/risk-matrix').then(m => m.RiskMatrix)
  },
  
  // Dashboard principal (común para todos los usuarios autenticados)
  { 
    path: '', 
    loadComponent: () => import('./layout/component/app.layout').then(m => m.AppLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      }
    ]
  },

  // ========== RUTAS PARA ADMINISTRADORES ==========
  

  // Gestión de Usuarios (nuevo)
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent),
    canActivate: [AdminGuard]
  },

  // Gestión de Proyectos (Admin)
  { 
    path: 'admin/projects',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/projects/new',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/project-config',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/assignments',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },

  // Reportes y Estadísticas (Admin)
  { 
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/dashboard/admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/reports/projects',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/reports/users',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/metrics',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },

  // Configuración del Sistema (Admin)
  { 
    path: 'admin/settings',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/backups',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/logs',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/notifications',
    loadComponent: () => import('./pages/admin/user-management').then(m => m.UserManagement),
    canActivate: [AdminGuard]
  },

  // ========== RUTAS PARA USUARIOS NORMALES ==========

  // Mis Proyectos (User)
  { 
    path: 'user/my-projects',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/projects/active',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/projects/completed',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/projects/pending',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },

  // Mis Tareas (User)
  { 
    path: 'user/tasks',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/tasks/todo',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/tasks/doing',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/tasks/done',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },

  // Mi Dashboard (User)
  { 
    path: 'user/dashboard',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/progress',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/stats',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },

  // Comunicaciones (User)
  { 
    path: 'user/notifications',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/messages',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  { 
    path: 'user/updates',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },

  // ========== RUTAS COMUNES (PERFIL) ==========
  { 
    path: 'profile',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent)
  },
  { 
    path: 'profile/edit',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent)
  },
  { 
    path: 'profile/password',
    loadComponent: () => import('./pages/dashboard/user/dashboard-user.component').then(m => m.DashboardUserComponent)
  },

  // ========== RUTAS EXISTENTES DE SAKAI ==========
  
  // Rutas de UIKit existentes
  { 
    path: 'uikit', 
    loadChildren: () => import('./pages/uikit/uikit.routes')
  },
  
  // Páginas existentes
  { 
    path: 'pages', 
    loadChildren: () => import('./pages/pages.routes')
  },
  
  // Redirección por defecto
  { 
    path: '**', 
    redirectTo: '/auth/login'
  }
];
