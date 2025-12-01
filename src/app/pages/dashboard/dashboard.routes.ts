import { Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { UserGuard } from '../../guards/user.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'user',
    loadComponent: () => import('./user/dashboard-user.component').then(m => m.DashboardUserComponent),
    canActivate: [UserGuard]
  },
  {
    path: 'riesgos',
    loadComponent: () => import('../../risk-matrix/risk-matrix').then(m => m.RiskMatrix)
  },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  }
];
