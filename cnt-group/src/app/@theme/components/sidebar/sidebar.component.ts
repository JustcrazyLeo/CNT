import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MenuService } from "../menu/services/menu.service";
import { MenuItem } from '../models/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems = [
    { icon: '🏠', label: 'Главная', link: '/' },
    { icon: '📊', label: 'Дашборд', link: '/dashboard' },
    { icon: '📝', label: 'Записи', link: '/posts' },
    { icon: '👥', label: 'Пользователи', link: '/users' },
    { icon: '⚙️', label: 'Настройки', link: '/settings' },
    { icon: '📚', label: 'Документация', link: '/docs' },
    { icon: '📧', label: 'Сообщения', link: '/messages' },
    { icon: '📈', label: 'Аналитика', link: '/analytics' }
  ];

  selectedItem: MenuItem | null = null;
  isSidebarVisible: boolean = true;
  private resizeTimer: any;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      this.isSidebarVisible = JSON.parse(savedState);
    }

    this.updateBodyClass();
    this.updateCssVariables();

    this.menuService.currentItem$.subscribe(item => {
      this.selectedItem = item;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarVisible));
    this.updateBodyClass();
    this.updateCssVariables();
  }

  private updateBodyClass() {
    document.body.classList.remove('sidebar-expanded', 'sidebar-collapsed');
    if (this.isSidebarVisible) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  private updateCssVariables() {
    const root = document.documentElement;

    if (window.innerWidth <= 576) {
      root.style.setProperty('--sidebar-width', '100%');
      root.style.setProperty('--sidebar-width-collapsed', '0px');
    } else if (window.innerWidth <= 768) {
      root.style.setProperty('--sidebar-width', '200px');
      root.style.setProperty('--sidebar-width-collapsed', '50px');
    } else {
      root.style.setProperty('--sidebar-width', '250px');
      root.style.setProperty('--sidebar-width-collapsed', '60px');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.updateCssVariables();

      if (window.innerWidth < 576 && this.isSidebarVisible) {
        this.isSidebarVisible = false;
        this.updateBodyClass();
        localStorage.setItem('sidebarState', 'false');
      }
    }, 150);
  }

  ngOnDestroy() {
    document.body.classList.remove('sidebar-expanded', 'sidebar-collapsed');
    clearTimeout(this.resizeTimer);
  }
}
