import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EstudianteRiesgo } from '../../../../core/interfaces/estudiante-riesgo.interface';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { AppSearchBox } from '../../../../shared/ui/app-search-box/app-search-box';
import { OnboardingService } from '../../../../core/services/onboarding.service';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppSearchBox
  ],
  templateUrl: './estudiante-list.html',
  styleUrl: './estudiante-list.css'
})
export class EstudianteList {

  private estudianteService = inject(EstudianteService);
  private cdr = inject(ChangeDetectorRef);
  private onboardingService = inject(OnboardingService)
  estudiantes: EstudianteRiesgo[] = [];
  searchTerm = '';
  selectedRisk = 'todos';
  currentPage = 1;
  pageSize = 20;

  ngOnInit(): void {

    this.estudianteService
      .getEstudiantesRiesgo()
      .subscribe(data => {

        this.estudiantes =
          data;

        this.cdr.detectChanges();

      });

    setTimeout(() => {
      this.onboardingService.startStudentsTour();
    }, 1000);
  }

  get estudiantesFiltrados(): EstudianteRiesgo[] {

    return this.estudiantes
      .filter(estudiante => {

        const search =
          this.searchTerm
            .toLowerCase();

        const matchesSearch =
          estudiante.nombre
            .toLowerCase()
            .includes(search)
          ||
          estudiante.curso
            .toLowerCase()
            .includes(search);

        const matchesRisk =
          this.selectedRisk === 'todos'
          ||
          estudiante.nivelRiesgo ===
          this.selectedRisk;

        return (
          matchesSearch &&
          matchesRisk
        );

      })
      .sort(
        (a, b) =>
          b.probabilidad -
          a.probabilidad
      );

  }

  get estudiantesPaginados(): EstudianteRiesgo[] {

    const start =
      (this.currentPage - 1)
      * this.pageSize;

    if (
      this.currentPage >
      this.totalPages
    ) {

      this.currentPage = 1;

    }

    return this.estudiantesFiltrados
      .slice(
        start,
        start + this.pageSize
      );

  }

  get totalPages(): number {

    return Math.ceil(
      this.estudiantesFiltrados.length /
      this.pageSize
    );

  }

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }

  get totalCriticos(): number {

    return this.estudiantes.filter(
      e => e.nivelRiesgo === 'critico'
    ).length;

  }

  get totalAltos(): number {

    return this.estudiantes.filter(
      e => e.nivelRiesgo === 'alto'
    ).length;

  }

  get totalMedios(): number {

    return this.estudiantes.filter(
      e => e.nivelRiesgo === 'medio'
    ).length;

  }

  get totalBajos(): number {

    return this.estudiantes.filter(
      e => e.nivelRiesgo === 'bajo'
    ).length;

  }

  setRiskFilter(risk: string): void {

    this.selectedRisk = risk;

    this.currentPage = 1;

  }

  onSearchChange(value: string): void {

    this.searchTerm = value;

    this.currentPage = 1;

  }

  get totalEstudiantes(): number {

    return this.estudiantes.length;

  }

  get startRecord(): number {

    if (!this.estudiantesFiltrados.length) {

      return 0;

    }

    return (
      (this.currentPage - 1)
      * this.pageSize
    ) + 1;

  }

  get endRecord(): number {

    return Math.min(

      this.currentPage * this.pageSize,

      this.estudiantesFiltrados.length

    );

  }
}