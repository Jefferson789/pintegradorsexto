import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppSidebar } from '../../components/app-sidebar/app-sidebar';
import { AppHeader } from '../../components/app-header/app-header';
import { AuthService } from '../../../core/services/auth.service';
import { AppBreadcrumb } from '../../components/app-breadcrumb/app-breadcrumb';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AppSidebar,
    AppHeader,
    AppBreadcrumb
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  mobileMenuOpen = false;

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileMenuOpen = !this.mobileMenuOpen;

      return;
    }

    this.sidebarCollapsed = !this.sidebarCollapsed;

    localStorage.setItem('sidebar-collapsed', String(this.sidebarCollapsed)
    );
  }

  ngOnInit(): void {
    if (
      window.innerWidth > 768 &&
      window.innerWidth <= 992
    ) {
      this.sidebarCollapsed = true;
    }

    this.authService
      .me()
      .subscribe({
        next: () => {

          // Token válido

        },
        error: () => {
          this.authService.logout();

          this.router.navigate([
            '/'
          ]);
        }
      });
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate([
      '/'
    ]);
  }
}
