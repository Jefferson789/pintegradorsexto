import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private readonly STORAGE_KEY = 'siade-onboarding-completed';

    completed(): boolean {
        return localStorage.getItem(
            this.STORAGE_KEY
        ) === 'true';
    }

    markAsCompleted(): void {
        localStorage.setItem(
            this.STORAGE_KEY,
            'true'
        );
    }

    reset(): void {
        localStorage.removeItem(
            this.STORAGE_KEY
        );
    }

    startDashboardTour(): void {
        const tour = introJs();
        tour.setOptions({
            nextLabel: 'Siguiente →',
            prevLabel: '← Anterior',
            doneLabel: '✅ Finalizar',
            skipLabel: 'Omitir',

            showProgress: true,
            showBullets: false,
            exitOnOverlayClick: false,

            steps: [
                {
                    title: '🎓 Bienvenido a SIADE',
                    intro: `
        Sistema Inteligente de Alerta para la
        Deserción Escolar.

        Este recorrido le permitirá conocer las
        herramientas de monitoreo institucional,
        análisis predictivo y detección temprana
        del riesgo de abandono escolar.

        Duración estimada: 1 minuto.
        `
                },
                {
                    element: document.querySelector(
                        '[data-tour="dashboard-summary"]'
                    ) as HTMLElement,
                    title: '📊 Estado Institucional',
                    intro: `
        Este panel resume la situación actual
        de la institución, mostrando indicadores
        clave como riesgo alto, asistencia,
        rendimiento académico y factores de
        vulnerabilidad.
        `,
                    position: 'bottom'
                },
                {
                    title: '🚀 Ya está listo',
                    intro: `
        Ya conoce los principales indicadores de
        SIADE.

        Puede continuar explorando el sistema y
        utilizar la información para apoyar la toma
        de decisiones institucionales.
        `
                }
            ]

        });

        tour.oncomplete(() => {
            this.markAsCompleted();
        });

        tour.onexit(() => {
            this.markAsCompleted();
        });
        tour.start();
    }

    startStudentsTour(): void {

        const tour = introJs();

        tour.setOptions({

            nextLabel: 'Siguiente →',
            prevLabel: '← Anterior',
            doneLabel: '✅ Finalizar',
            skipLabel: 'Omitir',

            showProgress: true,
            showBullets: false,

            steps: [

                {
                    title: '🎓 Gestión de Riesgo',
                    intro: `
                Desde este módulo puede identificar
                estudiantes en riesgo y realizar
                seguimiento oportuno.
                `
                },

                {
                    element: document.querySelector(
                        '[data-tour="student-filters"]'
                    ) as HTMLElement,

                    title: '🎯 Filtros de Riesgo',

                    intro: `
                Filtre estudiantes según el nivel
                de riesgo detectado.
                `
                },

                {
                    element: document.querySelector(
                        '[data-tour="student-list"]'
                    ) as HTMLElement,

                    title: '🚨 Alertas Detectadas',

                    intro: `
                Cada tarjeta muestra la probabilidad
                de abandono y los factores de riesgo
                principales.
                `
                },

                {
                    element: document.querySelector(
                        '[data-tour="student-followup"]'
                    ) as HTMLElement,

                    title: '📋 Seguimiento',

                    intro: `
                Acceda al expediente completo del
                estudiante y sus intervenciones.
                `
                },

                {
                    title: '🚀 Ya está listo',

                    intro: `
                Ya conoce las principales herramientas
                para el monitoreo del riesgo estudiantil.
                `
                }

            ]

        });

        tour.start();

    }
}