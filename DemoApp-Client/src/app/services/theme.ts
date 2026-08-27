// src/app/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Initialize the signal checking localStorage or falling back to system preference
  currentTheme = signal<string>(localStorage.getItem('user-theme') || 'light');

  constructor() {
    // Leverage an Angular effect to reactively update the HTML class tree whenever the signal mutates
    effect(() => {
      const root = document.documentElement;
      const theme = this.currentTheme();

      if (theme === 'dark') {
        root.classList.add('dark');
        // Tell Tailwind v4 or standard engines explicit theme state parameters
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      localStorage.setItem('user-theme', theme);
    });
  }

  toggleTheme(): void {
    this.currentTheme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }
}
