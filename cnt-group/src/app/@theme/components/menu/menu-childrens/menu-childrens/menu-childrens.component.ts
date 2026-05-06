import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../../models/menu.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-menu-childrens',
  templateUrl: './menu-childrens.component.html',
  styleUrls: ['./menu-childrens.component.css']
})
export class MenuChildrensComponent implements OnInit {
  @Input() sidebarHidden: boolean = true;
  @Input() parentItem: MenuItem | null = null;
  menuChildrenItems: MenuItem[] | null = null;

  constructor(public menuService: MenuService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.parentItem) {
      this.menuChildrenItems = this.menuService.getChildrenItems(this.parentItem);
    } else {
      this.menuService.currentItem$.subscribe(currentItem => {
        if (currentItem) {
          this.menuChildrenItems = this.menuService.getChildrenItems(currentItem);
        }
      });
    }
  }

  toggleSubMenu(item: MenuItem, event: Event) {
    event.stopPropagation();
    item.showSubMenu = !item.showSubMenu;

    if (item.showSubMenu) {
      item.subMenuItems = this.menuService.getChildrenItems(item);
    } else {
      item.subMenuItems = null;
    }
  }

  getSafeHtml(icon: string | null): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon || '');
  }
}
