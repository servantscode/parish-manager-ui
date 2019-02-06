import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role/role.component';

const routes: Routes = [
  { path: 'admin/role', component: RoleComponent },
  { path: 'admin', component: RoleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
