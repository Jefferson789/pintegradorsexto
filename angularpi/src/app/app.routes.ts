import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        component: Login,
        canActivate: [
            guestGuard
        ],
        pathMatch: 'full'
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [
            authGuard
        ],
        children: [
            {
                path: 'dashboard',
                canActivate: [
                    roleGuard
                ],
                data: {
                    breadcrumb: 'Dashboard',
                    roles: [
                        'administrador',
                        'director'
                    ]
                },
                loadComponent: () => import('./features/dashboard/pages/dashboard-home/dashboard-home').then(c => c.DashboardHome)
            },
            {
                path: 'usuario',
                canActivate: [
                    roleGuard
                ],
                data: {
                    breadcrumb: 'Usuarios',
                    roles: [
                        'administrador'
                    ]
                },
                loadChildren: () => import('./features/usuario/usuario.routes').then(m => m.usuarioRoutes)
            },
            {
                path: 'estudiantes',
                canActivate: [
                    roleGuard
                ],
                data: {
                    breadcrumb: 'Estudiantes',
                    roles: [
                        'administrador',
                        'director',
                        'docente'
                    ]
                },
                loadChildren: () => import('./features/estudiante/estudiante.routes').then(m => m.estudianteRoutes)
            }
        ]
    },
    {
        path: '403',
        loadComponent: () => import('./shared/pages/access-denied/access-denied').then(c => c.AccessDenied)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
