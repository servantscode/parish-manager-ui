import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { SystemTabsComponent } from './system-tabs/system-tabs.component';

const routes: Routes = [
  { path: 'system/:tab', component: SystemTabsComponent, canActivate: [AuthGuard] },
  { path: 'system', component: SystemTabsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
