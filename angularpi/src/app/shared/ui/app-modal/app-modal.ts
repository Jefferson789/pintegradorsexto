// src/app/shared/ui/app-modal/app-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-modal.html',
  styleUrl: './app-modal.css'
})
export class AppModal {
  @Input() isOpen = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() type: 'warning' | 'error' | 'info' = 'warning';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm(): void {
    this.onConfirm.emit();
    this.isOpen = false;
  }

  cancel(): void {
    this.onCancel.emit();
    this.isOpen = false;
  }

  onBackdropClick(): void {
    this.cancel();
  }
}