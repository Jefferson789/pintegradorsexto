import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-alert.html',
  styleUrl: './app-alert.css'
})
export class AppAlert implements OnChanges {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() message = '';
  @Input() duration: number = 3000; // 3 segundos

  isVisible = false;
  private timer: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      if (this.message) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show(): void {
    if (this.timer) clearTimeout(this.timer);

    // Forzamos que sea visible
    this.isVisible = true;

    // Programamos el ocultamiento
    this.timer = setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  hide(): void {
    this.isVisible = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  close(): void {
    this.hide();
  }

  get icon(): string {
    switch (this.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}