import { Routes } from '@angular/router';
import { EstudianteList } from './pages/estudiante-list/estudiante-list';
import { EstudianteDetail } from './pages/estudiante-detail/estudiante-detail';

export const estudianteRoutes: Routes = [

    {
        path: '',
        component: EstudianteList,
        data: {
            breadcrumb: 'Listado'
        }
    },

    {
        path: ':id',
        component: EstudianteDetail,
        data: {
            breadcrumb: 'Seguimiento'
        }
    }

];