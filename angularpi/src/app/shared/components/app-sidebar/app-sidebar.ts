import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  @Input()
  collapsed = false;

  @Output()
  closeMobileMenu = new EventEmitter<void>();

  constructor(
    public sessionService: SessionService
  ) { }

  hasRole(
    ...roles: string[]
  ): boolean {
    return this.sessionService
      .hasRole(
        ...roles
      );
  }

  // Estado del tooltip
  tooltipVisible = false;
  tooltipType: 'admin' | 'analisis' | null = null;
  tooltipX = 0;
  tooltipY = 0;
  hideTimeout: any;

  // Estado de los acordeones
  adminExpanded = false;
  analisisExpanded = false;

  showTooltip(event: MouseEvent, type: 'admin' | 'analisis') {
    if (this.collapsed) {
      // Limpiar cualquier timeout previo
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      this.tooltipType = type;
      this.tooltipVisible = true;

      // Posicionar el tooltip a la derecha del icono, alineado verticalmente
      const iconRect = (event.target as HTMLElement).getBoundingClientRect();
      this.tooltipX = iconRect.right + 10; // 10px de espacio a la derecha
      this.tooltipY = iconRect.top; // Alineado con la parte superior del icono
    }
  }

  hideTooltipDelay() {
    // Esperar un poco antes de ocultar para permitir que el mouse vaya al tooltip
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100); // 100ms de delay
  }

  keepTooltip() {
    // Mantener el tooltip visible si el mouse está sobre él
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  hideTooltip() {
    this.tooltipVisible = false;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  toggleAccordion(type: 'admin' | 'analisis') {
    if (type === 'admin') {
      this.adminExpanded = !this.adminExpanded;
    } else {
      this.analisisExpanded = !this.analisisExpanded;
    }

    // Ocultar tooltip al expandir
    this.hideTooltip();
  }

  @HostBinding('style.width')
  get width(): string {
    return this.collapsed ? '80px' : '260px';
  }
}