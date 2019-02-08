import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

import { MetricsComponent } from './metrics/metrics.component';


const routes: Routes = [
  { path: 'metrics', component: MetricsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetricsRoutingModule { }
