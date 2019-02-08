import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { MetricsComponent } from './metrics/metrics.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'metrics', component: MetricsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/person', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
