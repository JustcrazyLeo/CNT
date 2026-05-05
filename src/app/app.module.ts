// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // ← добавить

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './@theme/components/header/header.component';
import { FooterComponent } from './@theme/components/footer/footer.component';
import { SidebarComponent } from './@theme/components/sidebar/sidebar.component';
import { MenuParentsComponent } from './@theme/components/menu/components/menu-parents/menu-parents.component';
import { MenuChildrensComponent } from './@theme/components/menu/components/menu-childrens/menu-childrens.component';
import { ThemeSwitcherComponent } from './@theme/components/header/theme/theme-switcher/theme-switcher.component';
import { MainPageComponent } from './pages/sections/main-page/main-page.component';
import { ProjectComponent } from './@theme/components/menu/components/project/project.component';
import { SharedModule } from './domains/users/models/shared/shared.module';
import { PagesRoutingModule } from './pages/pages-routing.module';

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
    MainPageComponent,
    ProjectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // ← добавить
    SharedModule,
    PagesRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
