import { Component } from '@angular/core';
import { ThemeSwitcherService, ThemeMode } from './services/theme-switcher.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent {
  currentTheme: ThemeMode;

  constructor(private themeService: ThemeSwitcherService) {
    this.currentTheme = this.themeService.currentTheme;
  }

  toggleTheme(): void {
    const button = document.querySelector('.theme-switcher__button');
    if (button) {
      button.classList.add('theme-switch-animate');

      const newTheme = this.themeService.toggleTheme();
      this.currentTheme = newTheme;

      setTimeout(() => {
        button.classList.remove('theme-switch-animate');
      }, 600);
    } else {
      const newTheme = this.themeService.toggleTheme();
      this.currentTheme = newTheme;
    }
  }

  getThemeTitle(): string {
    return this.themeService.getThemeLabel();
  }
}
