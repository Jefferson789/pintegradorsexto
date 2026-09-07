import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle {
  constructor(
    private themeService: ThemeService
  ) { }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
