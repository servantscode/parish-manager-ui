import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role/role.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'admin/role', component: RoleComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: RoleComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
