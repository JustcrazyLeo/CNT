import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { AdminsListComponent } from './pages/admin-page/components/admins-list/admins-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'admins',
        component: AdminsListComponent
      }
    ]
  },
  {
    path: 'users',
    component: UsersPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }