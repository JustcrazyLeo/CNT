import { Injectable } from '@angular/core';

export type ThemeMode = 'light-theme' | 'dark-theme' | 'ocean-theme';

interface ThemeVariables {
  background: string;
  text: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbBorder: string;
  scrollbarThumbHover: string;

  indigo500: string;
  blockBackground: string;
  blockBorderColor: string;
  focusColor: string;
  blockChildBackground: string;
  blockChildBorderColor: string;

  sidebarBackground: string;
  sidebarText: string;
  sidebarBorder: string;
  footerBackground: string;
  footerText: string;
  footerBorder: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  currentTheme: ThemeMode = 'light-theme';

  private readonly themeOrder: ThemeMode[] = ['light-theme', 'dark-theme', 'ocean-theme'];

  private readonly themeVariables: Record<ThemeMode, ThemeVariables> = {
    'light-theme': {
      background: 'white',
      text: '#1a1a1a',
      scrollbarTrack: '#f1f1f1',
      scrollbarThumb: '#c1c1c1',
      scrollbarThumbBorder: '#f1f1f1',
      scrollbarThumbHover: '#a8a8a8',
      indigo500: 'rgb(63, 81, 181)',
      blockBackground: 'white',
      blockBorderColor: 'rgb(235, 235, 235)',
      focusColor: 'rgb(63, 81, 181)',
      blockChildBackground: 'rgb(236, 236, 236)',
      blockChildBorderColor: '#1c2430',
      sidebarBackground: '#34495e',
      sidebarText: 'white',
      sidebarBorder: '#2c3e50',
      footerBackground: '#2c3e50',
      footerText: 'white',
      footerBorder: '#2c3e50'
    },
    'dark-theme': {
      background: '#121212',
      text: '#f5f5f5',
      scrollbarTrack: '#2d2d2d',
      scrollbarThumb: '#555555',
      scrollbarThumbBorder: '#2d2d2d',
      scrollbarThumbHover: '#666666',
      indigo500: 'rgb(129, 140, 248)',
      blockBackground: '#1a1a1a',
      blockBorderColor: '#333333',
      focusColor: 'rgb(129, 140, 248)',
      blockChildBackground: '#2d2d2d',
      blockChildBorderColor: '#444444',
      sidebarBackground: '#1a1a1a',
      sidebarText: '#f5f5f5',
      sidebarBorder: '#333333',
      footerBackground: '#1a1a1a',
      footerText: '#f5f5f5',
      footerBorder: '#333333'
    },
    'ocean-theme': {
      background: '#0a192f',
      text: '#ccd6f6',
      scrollbarTrack: '#172a45',
      scrollbarThumb: '#64ffda',
      scrollbarThumbBorder: '#172a45',
      scrollbarThumbHover: '#52d7b7',
      indigo500: '#64ffda',
      blockBackground: '#112240',
      blockBorderColor: '#233554',
      focusColor: '#64ffda',
      blockChildBackground: '#1d3a5f',
      blockChildBorderColor: '#2a4a75',
      sidebarBackground: '#0c2d4f',
      sidebarText: '#8892b0',
      sidebarBorder: '#1a3a5f',
      footerBackground: '#0c2d4f',
      footerText: '#8892b0',
      footerBorder: '#1a3a5f'
    }
  };

  constructor() {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && this.themeOrder.includes(savedTheme)) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme, false);
    } else {
      this.applyTheme(this.currentTheme, false);
    }
  }

  setTheme(theme: ThemeMode): void {
    if (!this.themeOrder.includes(theme)) return;

    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  toggleTheme(): ThemeMode {
    const currentIndex = this.themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themeOrder.length;
    const newTheme = this.themeOrder[nextIndex];

    this.setTheme(newTheme);
    return newTheme;
  }

  getNextTheme(): ThemeMode {
    const currentIndex = this.themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themeOrder.length;
    return this.themeOrder[nextIndex];
  }

  getThemeLabel(): string {
    const labels = {
      'light-theme': 'Светлая',
      'dark-theme': 'Темная',
      'ocean-theme': 'Океан'
    };
    return labels[this.currentTheme];
  }

  getNextThemeLabel(): string {
    const nextTheme = this.getNextTheme();
    const labels = {
      'light-theme': 'Светлая',
      'dark-theme': 'Темная',
      'ocean-theme': 'Океан'
    };
    return labels[nextTheme];
  }

  private applyTheme(theme: ThemeMode, animate = true): void {
    const variables = this.themeVariables[theme];
    const root = document.documentElement;

    if (animate) {
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    Object.entries(variables).forEach(([key, value]) => {
      const cssVarName = this.toCssVariableName(key);
      root.style.setProperty(cssVarName, value);
    });

    document.body.className = theme;

    if (animate) {
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    }
  }

  private toCssVariableName(key: string): string {
    return '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  getThemeIcon(): string {
    const icons = {
      'light-theme': '☀️',
      'dark-theme': '🌙',
      'ocean-theme': '🌊'
    };
    return icons[this.currentTheme];
  }

  getThemeTitle(): string {
    return `${this.getThemeLabel()} тема (следующая: ${this.getNextThemeLabel()})`;
  }
}
