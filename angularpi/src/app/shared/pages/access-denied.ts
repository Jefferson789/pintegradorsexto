import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <div class="access-denied">

      <h1>403</h1>

      <h2>Acceso denegado</h2>

      <p>
        No tiene permisos para acceder a este módulo.
      </p>

      <a
        routerLink="/dashboard">

        Volver al Dashboard

      </a>

    </div>
  `
})
export class AccessDenied {}