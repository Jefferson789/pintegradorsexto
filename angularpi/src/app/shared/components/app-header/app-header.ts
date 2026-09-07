import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader implements OnInit {
  private elementRef = inject(ElementRef);
  private router = inject(Router);
private onboardingService = inject(OnboardingService);

  @Output()
  toggleSidebar = new EventEmitter<void>();

  @Output()
  logout = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside =
      this.elementRef.nativeElement.contains(
        event.target
      );
    if (!clickedInside) {
      this.isUserMenuOpen = false;
    }
  }

  constructor(
    public sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const usuario =
      sessionStorage.getItem(
        'usuario'
      );

    if (!usuario) {
      return;
    }

    const user = JSON.parse(usuario);
    this.userName = `${user.nombres} ${user.apellidos}`;
    this.userRole = user.rol;
  }

  isUserMenuOpen = false;
  userName = 'Administrador';
  userRole = 'Sistema';

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggleTheme(): void {
    document.body.classList.toggle(
      'dark-theme'
    );

    const isDark = document.body.classList.contains(
      'dark-theme'
    );

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  get formattedRole(): string {
    const roles: Record<string, string> = {
      administrador: 'Administrador',
      director: 'Director',
      docente: 'Docente',
      psicologo: 'Psicólogo',
      trabajador_social: 'Trabajador Social'
    };
    return roles[this.userRole] ?? this.userRole;
  }

  get roleClass(): string {
    const classes: Record<string, string> = {
      administrador:
        'role-admin',
      director:
        'role-director',
      docente:
        'role-docente',
      psicologo:
        'role-psicologo',
      trabajador_social:
        'role-social'
    };

    return classes[this.userRole] ?? '';
  }

  startCurrentTour(): void {

    const url = this.router.url;

    if (url.includes('/dashboard')) {

      this.onboardingService
        .startDashboardTour();

      return;
    }

    if (url.includes('/estudiantes')) {

      this.onboardingService
        .startStudentsTour();

      return;
    }

  }
}