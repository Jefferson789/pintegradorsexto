// src/app/features/usuario/usuarios.routes.ts
import { Routes } from '@angular/router';
import { UsuarioList } from './pages/usuario-list/usuario-list';
import { UsuarioForm } from './pages/usuario-form/usuario-form';

export const usuarioRoutes: Routes = [
    {
        path: '',
        component: UsuarioList,
        data: {
            breadcrumb: 'Listado'
        }
    },
    {
        path: 'nuevo',
        component: UsuarioForm,
        data: {
            breadcrumb: 'Nuevo Ususario'
        }
    },
    {
        path: 'editar/:id',
        component: UsuarioForm,
        data: {
            breadcrumb: 'Editar Usuario'
        }
    }
];