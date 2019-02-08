import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'ministry', component: MinistryListComponent, canActivate: [AuthGuard] },
  { path: 'ministry/detail', component: MinistryDetailComponent, canActivate: [AuthGuard] },
  { path: 'ministry/detail/:id', component: MinistryDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinistryRoutingModule { }
