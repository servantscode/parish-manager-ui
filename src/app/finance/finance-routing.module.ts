import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

import { DonationComponent } from './donation/donation.component';

const routes: Routes = [
  { path: 'donations', component: DonationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
