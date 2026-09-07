import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl;

    getEstudiantes() {
        return this.http.get<any[]>(
            `${this.apiUrl}/estudiantes`
        );
    }

    getAlertas() {
        return this.http.get<any[]>(
            `${this.apiUrl}/alertas-predictivas`
        );
    }

    getIntervenciones() {
        return this.http.get<any[]>(
            `${this.apiUrl}/intervenciones`
        );
    }

    getDataset() {
        return this.http.get<any[]>(
            `${this.apiUrl}/dataset-prediccion`
        );
    }
}