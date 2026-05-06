import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './sections/main-page/main-page.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';  // ДОБАВИТЬ

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],  // ДОБАВИТЬ - защита всех дочерних маршрутов
    children: [
      {
        path: 'mainPage',
        component: MainPageComponent,
      },
      {
        path: 'administration',
        loadChildren: () => import('../modules/administration/administration.module').then(module => module.AdministrationModule)
      },
      {
        path: '',
        redirectTo: 'mainPage',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }