import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  currentTheme: string = 'light-theme';
  private readonly PINK_THEME = 'pink-theme';
  private readonly THEME_KEY = 'current-theme';

  setTheme(theme: string): void {
    this.currentTheme = theme;
    document.body.className = theme;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  isPinkTheme(): boolean {
    return localStorage.getItem(this.THEME_KEY) === this.PINK_THEME;
  }

  togglePinkTheme(): void {
    if (this.isPinkTheme()) {
      this.setTheme('light-theme');
    } else {
      this.setTheme(this.PINK_THEME);
    }
  }
}