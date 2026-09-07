import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { EstudianteRiesgo } from '../interfaces/estudiante-riesgo.interface';

@Injectable({
    providedIn: 'root'
})
export class EstudianteService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl;

    getEstudiantesRiesgo(): Observable<EstudianteRiesgo[]> {

        return forkJoin({

            estudiantes: this.http.get<any[]>(
                `${this.apiUrl}/estudiantes`
            ),

            alertas: this.http.get<any[]>(
                `${this.apiUrl}/alertas-predictivas`
            )

        }).pipe(

            map(({ estudiantes, alertas }) => {

                return estudiantes.map(estudiante => {

                    const alerta = alertas.find(
                        a =>
                            a.id_estudiante ===
                            estudiante.id_estudiante
                    );

                    return {

                        id:
                            estudiante.id_estudiante,

                        nombre:
                            `${estudiante.nombres} ${estudiante.apellidos}`,

                        curso:
                            estudiante.curso?.nombre ?? '',

                        probabilidad:
                            alerta
                                ? Number(
                                    alerta.probabilidad_abandono
                                ) * 100
                                : 0,

                        nivelRiesgo:
                            alerta?.nivel_riesgo ?? 'bajo',

                        factorPrincipal:
                            alerta?.factores_principales?.[0] ??
                            'Sin factores'

                    };

                });

            })

        );

    }

    getEstudianteById(
        id: number
    ): Observable<any> {

        return this.http.get<any>(
            `${this.apiUrl}/estudiantes/${id}`
        );

    }

    getAlertas(): Observable<any[]> {

        return this.http.get<any[]>(
            `${this.apiUrl}/alertas-predictivas`
        );

    }

    getAlertasByEstudiante(
        idEstudiante: number
    ): Observable<any[]> {

        return this.http
            .get<any[]>(
                `${this.apiUrl}/alertas-predictivas`
            )
            .pipe(

                map(alertas =>
                    alertas.filter(
                        alerta =>
                            alerta.id_estudiante ===
                            idEstudiante
                    )
                )

            );

    }

    getIntervenciones(): Observable<any[]> {

        return this.http.get<any[]>(
            `${this.apiUrl}/intervenciones`
        );

    }

    getIntervencionesByEstudiante(
        idEstudiante: number
    ): Observable<any[]> {

        return this.http
            .get<any[]>(
                `${this.apiUrl}/intervenciones`
            )
            .pipe(

                map(intervenciones =>
                    intervenciones.filter(
                        intervencion =>
                            intervencion.id_estudiante ===
                            idEstudiante
                    )
                )

            );

    }

    createIntervencion(
        intervencion: any
    ) {

        return this.http.post(
            `${this.apiUrl}/intervenciones`,
            intervencion
        );

    }

}