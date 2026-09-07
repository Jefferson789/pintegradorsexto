import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  hidePassword = true;
  loginForm: FormGroup;
  alertMessage = '';

  get isDarkTheme(): boolean {
    return document.body.classList.contains(
      'dark-theme'
    );
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    this.loginForm = this.fb.group({
      cedula: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15)
        ]
      ]
    });
  }

  login(): void {
    this.alertMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const {
      cedula,
      contrasena
    } = this.loginForm.value;

    this.authService
      .login(
        cedula,
        contrasena
      )
      .subscribe({
        next: (response) => {
          sessionStorage.setItem(
            'token',
            response.access_token
          );

          sessionStorage.setItem(
            'usuario',
            JSON.stringify(
              response.usuario
            )
          );

          sessionStorage.setItem(
            'lastLogin',
            new Date().toISOString()
          );

          this.toast.success(
            'Bienvenido al sistema.'
          );

          this.router.navigate([
            '/dashboard'
          ]);
        },
        error: (error) => {
          const mensaje = error?.error?.message || 'No fue posible iniciar sesión.';
          this.toast.error(
            mensaje
          );
        }
      });
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );
  }

  clearAlert(): void {
    this.alertMessage = '';
  }
}
