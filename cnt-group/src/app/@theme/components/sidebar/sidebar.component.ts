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

  constructor(private menuService: MenuService) { }

  ngOnInit() {

    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      this.isSidebarVisible = JSON.parse(savedState);
    }

    this.updateBodyClass();

    this.menuService.currentItem$.subscribe(item => {
      this.selectedItem = item;
    });
  }

toggleSidebar() {
  this.isSidebarVisible = !this.isSidebarVisible;
  localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarVisible));
  this.updateBodyClass();
}

private updateBodyClass() {
  document.body.classList.remove('sidebar-expanded', 'sidebar-collapsed');
  if (this.isSidebarVisible) {
    document.body.classList.add('sidebar-expanded');
  } else {
    document.body.classList.add('sidebar-collapsed');
  }
}
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 576) {
      if (this.isSidebarVisible) {
        this.isSidebarVisible = false;
        this.updateBodyClass();
      }
    }
  }

  ngOnDestroy() {

    document.body.classList.remove('sidebar-expanded', 'sidebar-collapsed');
  }
}
