import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardMetrics } from '../../../../core/interfaces/dashboard-metrics.interface';
import { forkJoin } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule, NgClass } from '@angular/common';
import { ReportService } from '../../../../shared/reports/report.service';
import { OnboardingService } from '../../../../core/services/onboarding.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    BaseChartDirective,
    NgClass,
    CommonModule
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private reportService = inject(ReportService);
  private onboardingService = inject(OnboardingService);

  metrics: DashboardMetrics = {
    totalEstudiantes: 0,
    totalAlertas: 0,
    totalIntervenciones: 0,

    riesgoAlto: 0,
    riesgoMedio: 0,
    riesgoBajo: 0,

    promedioAcademico: 0,
    promedioAsistencia: 0,
    promedioReprobadas: 0,

    sinInternet: 0,
    victimasViolencia: 0,
    trabajoInfantil: 0
  };

  topAlertas: any[] = [];
  ultimasIntervenciones: any[] = [];
  factoresDetectados: {
    factor: string;
    cantidad: number;
  }[] = [];
  principalFactor = 'Sin datos';
  riesgoPorcentaje = 0;
  today: Date = new Date();
  indiceImpacto = 0;

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {

    forkJoin({
      estudiantes: this.dashboardService.getEstudiantes(),
      alertas: this.dashboardService.getAlertas(),
      intervenciones: this.dashboardService.getIntervenciones(),
      dataset: this.dashboardService.getDataset()
    }).subscribe(({ estudiantes, alertas, intervenciones, dataset }) => {
      this.metrics.totalEstudiantes = estudiantes.length;
      this.metrics.totalAlertas = alertas.length;
      this.metrics.totalIntervenciones = intervenciones.length;

      const prioridadRiesgo: Record<string, number> = {
        bajo: 1,
        medio: 2,
        alto: 3
      };

      const riesgoPorEstudiante = new Map<number, string>();

      alertas.forEach(alerta => {

        const id = alerta.estudiante.id_estudiante;
        const nivel = alerta.nivel_riesgo;

        const riesgoActual = riesgoPorEstudiante.get(id);

        if (
          !riesgoActual ||
          prioridadRiesgo[nivel] >
          prioridadRiesgo[riesgoActual]
        ) {
          riesgoPorEstudiante.set(id, nivel);
        }

      });

      const nivelesFinales =
        Array.from(riesgoPorEstudiante.values());

      this.metrics.riesgoAlto =
        nivelesFinales.filter(
          nivel => nivel === 'alto'
        ).length;

      this.metrics.riesgoMedio =
        nivelesFinales.filter(
          nivel => nivel === 'medio'
        ).length;

      this.metrics.riesgoBajo =
        nivelesFinales.filter(
          nivel => nivel === 'bajo'
        ).length;

      const sinRiesgo =
        this.metrics.totalEstudiantes -
        (
          this.metrics.riesgoAlto +
          this.metrics.riesgoMedio +
          this.metrics.riesgoBajo
        );

      this.riskChartData = {
        labels: [
          'Alto',
          'Medio',
          'Bajo',
          'Sin Riesgo'
        ],
        datasets: [
          {
            data: [
              this.metrics.riesgoAlto,
              this.metrics.riesgoMedio,
              this.metrics.riesgoBajo,
              sinRiesgo
            ]
            ,
            backgroundColor: [
              '#dc2626',
              '#f59e0b',
              '#16a34a',
              '#94a3b8'
            ]
          }
        ]
      };

      this.metrics.promedioAcademico =
        Number(
          (
            dataset.reduce(
              (acc, item) =>
                acc + Number(item.promedio_general),
              0
            ) / dataset.length
          ).toFixed(2)
        );

      this.metrics.promedioAsistencia =
        Number(
          (
            dataset.reduce(
              (acc, item) =>
                acc + Number(item.porcentaje_asistencia),
              0
            ) / dataset.length
          ).toFixed(2)
        );

      this.metrics.promedioReprobadas =
        Number(
          (
            dataset.reduce(
              (acc, item) =>
                acc + item.materias_reprobadas,
              0
            ) / dataset.length
          ).toFixed(2)
        );

      this.metrics.sinInternet =
        dataset.filter(x => x.tiene_internet === 0).length;

      this.metrics.victimasViolencia =
        dataset.filter(
          x => x.es_victima_violencia === 1
        ).length;

      this.metrics.trabajoInfantil =
        dataset.filter(
          x => x.es_trabajador_infantil === 1
        ).length;

      this.vulnerabilityChartData = {
        labels: [
          'Sin Internet',
          'Violencia',
          'Trabajo Infantil'
        ],
        datasets: [
          {
            data: [
              this.metrics.sinInternet,
              this.metrics.victimasViolencia,
              this.metrics.trabajoInfantil
            ],
            backgroundColor: [
              '#3b82f6',
              '#ef4444',
              '#f59e0b'
            ]
          }
        ]
      };

      const estudianteMap = new Map();

      alertas.forEach(alerta => {

        const id =
          alerta.estudiante.id_estudiante;

        const actual =
          estudianteMap.get(id);

        const probabilidad =
          Number(
            alerta.probabilidad_abandono
          );

        if (
          !actual ||
          probabilidad >
          actual.probabilidad
        ) {

          estudianteMap.set(
            id,
            {
              estudiante:
                alerta.estudiante,

              nivel_riesgo:
                alerta.nivel_riesgo,

              probabilidad,

              porcentaje:
                (
                  probabilidad * 100
                ).toFixed(2),

              factores:
                alerta.factores_principales ?? []
            }
          );

        }

      });

      this.topAlertas =
        Array.from(
          estudianteMap.values()
        )
          .sort(
            (a, b) =>
              b.probabilidad -
              a.probabilidad
          )
          .slice(0, 10);

      this.ultimasIntervenciones = [...intervenciones]
        .sort(
          (a, b) =>
            new Date(b.fecha_inicio).getTime() -
            new Date(a.fecha_inicio).getTime()
        )
        .slice(0, 10);

      const factoresMap = new Map<string, number>();

      alertas.forEach(alerta => {

        alerta.factores_principales?.forEach(
          (factor: string) => {

            factoresMap.set(
              factor,
              (factoresMap.get(factor) || 0) + 1
            );

          }
        );

      });

      this.factoresDetectados =
        Array.from(factoresMap.entries())
          .map(([factor, cantidad]) => ({
            factor,
            cantidad
          }))
          .sort(
            (a, b) => b.cantidad - a.cantidad
          )
          .slice(0, 10);

      if (this.factoresDetectados.length > 0) {
        this.principalFactor = this.factoresDetectados[0].factor;
      }

      this.riesgoPorcentaje = Number(
        (
          (this.metrics.riesgoAlto / this.metrics.totalEstudiantes) * 100
        ).toFixed(1)
      );

      this.indiceImpacto = Number(
        (
          100 - this.riesgoPorcentaje
        ).toFixed(1)
      );

      this.cdr.detectChanges();

      setTimeout(() => {
        if (!this.onboardingService.completed()) {
          this.onboardingService.startDashboardTour();
        }
      })
    });
  }

  public riskChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Alto', 'Medio', 'Bajo'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#dc2626',
          '#f59e0b',
          '#16a34a'
        ],
        borderWidth: 0
      }
    ]
  };

  public riskChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  public vulnerabilityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Sin Internet',
      'Violencia',
      'Trabajo Infantil'
    ],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#f59e0b'
        ]
      }
    ]
  };

  public vulnerabilityChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public impactChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Antes de SIADE',
      'Año 1',
      'Año 2',
      'Año 3'
    ],
    datasets: [
      {
        label: 'Casos de Riesgo Alto',
        data: [
          38,
          29,
          21,
          12
        ],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };

  public impactChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: 'Casos de Riesgo Alto'
        }
      },

      x: {
        title: {
          display: true,
          text: 'Periodo'
        }
      }
    }
  };

  formatTipoIntervencion(
    tipo: string
  ): string {

    const tipos: Record<string, string> = {

      orientacion: 'Orientación',

      tutoria: 'Tutoría',

      integral: 'Integral',

      social: 'Social',

      beca: 'Beca',

      llamada: 'Llamada',

      seguimiento: 'Seguimiento'

    };

    return tipos[tipo] ?? tipo;

  }

  formatResultado(
    resultado: string
  ): string {

    const resultados: Record<string, string> = {

      en_proceso: 'En proceso',

      sin_resultado: 'Sin resultado',

      exitosa: 'Exitosa',

      parcial: 'Parcial'

    };

    return resultados[resultado] ?? resultado;

  }

  exportDashboard(): void {

    this.reportService
      .generateDashboardReport(

        this.metrics,

        this.factoresDetectados,

        this.topAlertas

      );

  }


}