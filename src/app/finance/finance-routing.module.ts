import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

import { FinanceTabsComponent } from './finance-tabs/finance-tabs.component';

const routes: Routes = [
  { path: 'finance', component: FinanceTabsComponent, canActivate: [AuthGuard] },
  { path: 'finance/:tab', component: FinanceTabsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
