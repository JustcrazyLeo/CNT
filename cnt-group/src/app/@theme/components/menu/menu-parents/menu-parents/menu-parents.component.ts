import { Component } from '@angular/core';
import { MenuService } from '../../../menu/services/menu.service';
import { MenuItem } from '../../../models/menu.model';

@Component({
  selector: 'app-menu-parents',
  templateUrl: './menu-parents.component.html',
  styleUrls: ['./menu-parents.component.css']
})
export class MenuParentsComponent {

  menuParentItems: MenuItem[] = this.menuService.getParentItems();

  constructor(private menuService: MenuService) { }

  onSelectItem(event: Event, item: MenuItem) {
    event.preventDefault();
    this.menuService.setCurrentItem(item);
  }

}
