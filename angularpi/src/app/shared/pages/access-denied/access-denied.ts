import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'access-denied',
  imports: [],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
})
export class AccessDenied {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  goToLogin(): void {
    this.authService.logout();

    this.router.navigate([
      '/dashboard'
    ]);
  }
}
