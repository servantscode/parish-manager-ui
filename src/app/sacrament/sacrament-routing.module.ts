import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MassIntentionComponent } from './mass-intention/mass-intention.component';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'mass/intention', component: MassIntentionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SacramentRoutingModule { }
