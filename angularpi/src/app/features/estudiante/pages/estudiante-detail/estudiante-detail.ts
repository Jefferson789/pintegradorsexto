import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { AppFormLayout } from '../../../../shared/components/app-form-layout/app-form-layout';
import { ReportService } from '../../../../shared/reports/report.service';

@Component({
  selector: 'app-estudiante-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppFormLayout
  ],
  templateUrl: './estudiante-detail.html',
  styleUrl: './estudiante-detail.css'
})
export class EstudianteDetail
  implements OnInit {

  private route = inject(ActivatedRoute);
  private estudianteService = inject(EstudianteService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService)
  private reportService = inject(ReportService);

  estudiante: any;
  alertas: any[] = [];
  ultimaAlerta: any;
  intervenciones: any[] = [];
  showInterventionForm = false;
  interventionForm!: FormGroup;
  expandedInterventionId: number | null = null
  showRecommendationsModal = false;
  recomendacionesCaso: string[] = [];

  ngOnInit(): void {
    this.interventionForm =
      this.fb.group({

        tipo: [
          '',
          Validators.required
        ],

        descripcion: [
          '',
          Validators.required
        ],

        responsable: [
          '',
          Validators.required
        ],

        area: [
          '',
          Validators.required
        ],

        resultado: [
          'en_proceso',
          Validators.required
        ],

        observaciones: [
          ''
        ]

      });

    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'id'
        )
      );

    forkJoin({

      estudiante:
        this.estudianteService
          .getEstudianteById(id),

      alertas:
        this.estudianteService
          .getAlertasByEstudiante(id),

      intervenciones:
        this.estudianteService
          .getIntervencionesByEstudiante(id)

    })
      .subscribe({

        next: ({
          estudiante,
          alertas,
          intervenciones
        }) => {

          this.estudiante =
            estudiante;

          this.alertas =
            alertas;

          this.intervenciones =
            intervenciones;

          this.ultimaAlerta =
            alertas[0];

          this.buildRecommendations();

          this.cdr.detectChanges();

        }

      });

  }

  get riesgoClase(): string {

    switch (
    this.ultimaAlerta
      ?.nivel_riesgo
    ) {

      case 'critico':

        return 'critical';

      case 'alto':

        return 'high';

      case 'medio':

        return 'medium';

      default:

        return 'low';

    }

  }

  get porcentajeRiesgo(): number {

    return this.ultimaAlerta
      ? Number(
        this.ultimaAlerta
          .probabilidad_abandono
      ) * 100
      : 0;

  }

  saveIntervention(): void {
    if (
      this.interventionForm.invalid
    ) {
      this.interventionForm
        .markAllAsTouched();

      return;
    }

    const payload = {

      id_estudiante: this.estudiante.id_estudiante,

      fecha_inicio:
        new Date()
          .toISOString()
          .slice(0, 10)
          .replaceAll('-', ''),

      ...this.interventionForm.value

    };

    this.estudianteService
      .createIntervencion(
        payload
      )
      .subscribe({

        next: (intervencion: any) => {

          this.intervenciones.unshift(
            intervencion
          );

          this.showInterventionForm =
            false;

          this.interventionForm.reset({
            resultado:
              'en_proceso'
          });

          this.toast.success(
            'Intervención registrada correctamente.'
          );

          this.cdr.detectChanges();

        },

        error: () => {

          this.toast.error(
            'No fue posible registrar la intervención.'
          );

        }

      });

  }

  formatArea(area: string): string {

    const areas: Record<string, string> = {

      trabajo_social: 'Trabajo Social',

      psicologia: 'Psicología',

      direccion: 'Dirección'

    };

    return areas[area] ?? area;

  }

  get ultimaIntervencion(): any {

    if (!this.intervenciones.length) {
      return null;
    }

    return [...this.intervenciones]
      .sort(
        (a, b) =>
          new Date(b.fecha_inicio).getTime() -
          new Date(a.fecha_inicio).getTime()
      )[0];

  }

  toggleIntervention(
    id: number
  ): void {
    this.expandedInterventionId =
      this.expandedInterventionId === id
        ? null
        : id;
  }

  get intervencionesOrdenadas(): any[] {

    return [...this.intervenciones]
      .sort(
        (a, b) =>
          new Date(b.fecha_inicio).getTime()
          -
          new Date(a.fecha_inicio).getTime()
      );

  }

  private buildRecommendations(): void {

    this.recomendacionesCaso = [];

    if (!this.ultimaAlerta) {
      return;
    }

    this.recomendacionesCaso.push(
      'Mantener seguimiento permanente del estudiante.'
    );

    const factores =
      this.ultimaAlerta.factores_principales ?? [];

    if (
      factores.includes(
        'Ingreso económico bajo'
      )
    ) {

      this.recomendacionesCaso.push(
        'Coordinar apoyo socioeconómico y seguimiento familiar.'
      );

    }

    if (
      factores.includes(
        'Sin acceso a internet'
      )
    ) {

      this.recomendacionesCaso.push(
        'Gestionar mecanismos alternativos de acceso a recursos educativos.'
      );

    }

    if (
      factores.includes(
        'Violencia intrafamiliar'
      )
    ) {

      this.recomendacionesCaso.push(
        'Coordinar seguimiento con psicología y DECE.'
      );

    }

    if (
      factores.includes(
        'Baja asistencia'
      )
    ) {

      this.recomendacionesCaso.push(
        'Monitorear asistencia semanalmente.'
      );

    }

    if (
      factores.includes(
        'Bajo rendimiento académico'
      )
    ) {

      this.recomendacionesCaso.push(
        'Implementar refuerzo académico personalizado.'
      );

    }

  }

  exportStudentReport(): void {

    this.reportService
      .generateStudentReport(

        this.estudiante,

        this.ultimaAlerta,

        this.intervenciones

      );

  }

}