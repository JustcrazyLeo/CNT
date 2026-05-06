import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems: MenuItem[] = [
    {
      idItem: 1,
      itemName: 'Главная',
      itemLink: 'mainPage',
      iconTypeId: 1,
      icon: null,
      itemOrder: 1,
      parentItem: null,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 2,
      itemName: 'Статистика',
      itemLink: null,
      iconTypeId: 1,
      icon: null,
      itemOrder: 2,
      parentItem: null,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 3,
      itemName: 'Мониторинг',
      itemLink: 'NULL',
      iconTypeId: 1,
      icon: null,
      itemOrder: null,
      parentItem: 5,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 5,
      itemName: 'Dashboard',
      itemLink: 'dashboard',
      iconTypeId: 1,
      icon: '<svg class="menuIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg>',
      itemOrder: 3,
      parentItem: 1,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 7,
      itemName: 'Админ Панель',
      itemLink: 'administration',
      iconTypeId: 2,
      icon: null,
      itemOrder: 4,
      parentItem: null,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 8,
      itemName: 'Пользователи',
      itemLink: 'administration/users',
      iconTypeId: 1,
      icon: '<svg class="menuIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>',
      itemOrder: 1,
      parentItem: 7,
      showSubMenu: false,
      subMenuItems: []
    },
    // НОВЫЙ ПУНКТ "АДМИНЫ"
    {
      idItem: 10,
      itemName: 'Админы',
      itemLink: 'administration/admins',
      iconTypeId: 1,
      icon: '<svg class="menuIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>',
      itemOrder: 2,
      parentItem: 7,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 9,
      itemName: 'Общая',
      itemLink: 'statistics/general',
      iconTypeId: 1,
      icon: '',
      itemOrder: 1,
      parentItem: 2,
      showSubMenu: false,
      subMenuItems: []
    }
  ];

  private currentItemSubject = new BehaviorSubject<MenuItem>(this.menuItems[0]);
  currentItem$ = this.currentItemSubject.asObservable();

  constructor() { }

  getParentItems(): MenuItem[] {
    return this.menuItems.filter(item => item.parentItem === null);
  }

  getChildrenItems(selectedItem: MenuItem): MenuItem[] {
    return this.menuItems.filter(subItem => subItem.parentItem === selectedItem.idItem);
  }

  setCurrentItem(item: MenuItem): void {
    this.currentItemSubject.next(item);
  }
}