import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    
private readonly THEME_KEY = 'siade-theme';
  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {

    const body = document.body;

    body.classList.toggle('dark-theme');

    const isDark =
      body.classList.contains('dark-theme');

    localStorage.setItem(
      this.THEME_KEY,
      isDark ? 'dark' : 'light'
    );
  }

  loadTheme(): void {

    const savedTheme =
      localStorage.getItem(this.THEME_KEY);

    if (savedTheme === 'dark') {

      document.body.classList.add(
        'dark-theme'
      );

    }

  }

  isDarkTheme(): boolean {

    return document.body.classList.contains(
      'dark-theme'
    );

  }
}
