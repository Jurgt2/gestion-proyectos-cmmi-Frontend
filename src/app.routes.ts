import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { 
                path: '', 
                redirectTo: 'riesgos',
                pathMatch: 'full'
            },
            { 
                path: 'riesgos', 
                loadComponent: () => import('./app/risk-matrix/risk-matrix').then(m => m.RiskMatrix)
            },
            { 
                path: 'identificacion-riesgos', 
                loadComponent: () => import('./app/risk-identification/risk-identification').then(m => m.RiskIdentificationComponent)
            }
        ]
    },
    { path: 'login', loadComponent: () => import('./app/auth/login/login').then(m => m.Login) },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/riesgos' }
];
