import { Component, OnInit } from '@angular/core';
import { ThemeSwitcherService } from './services/theme-switcher.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent implements OnInit {
  currentTheme: string = this.themeService.currentTheme || 'light-theme';

  constructor(private themeService: ThemeSwitcherService) {}

  ngOnInit() {
    this.themeService.setTheme(this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(this.currentTheme);
  }

  togglePinkTheme() {
    this.themeService.togglePinkTheme();
    this.currentTheme = this.themeService.currentTheme;
  }
}