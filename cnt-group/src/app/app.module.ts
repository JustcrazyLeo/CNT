import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // ДОБАВИТЬ ЭТУ СТРОКУ

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './@theme/components/header/header.component';
import { FooterComponent } from './@theme/components/footer/footer.component';
import { SidebarComponent } from './@theme/components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MenuParentsComponent } from './@theme/components/menu/menu-parents/menu-parents/menu-parents.component';
import { CommonModule } from '@angular/common';
import { MenuChildrensComponent } from './@theme/components/menu/menu-childrens/menu-childrens/menu-childrens.component';
import { ThemeSwitcherComponent } from './@theme/components/header/theme-switcher/theme-switcher.component';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuParentsComponent,
    MenuChildrensComponent,
    ThemeSwitcherComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    SharedModule,
    HttpClientModule,  // ДОБАВИТЬ ЭТУ СТРОКУ
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }