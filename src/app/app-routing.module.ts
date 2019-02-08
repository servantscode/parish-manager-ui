import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { MetricsComponent } from './metrics/metrics.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'people', component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: 'person/detail', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person/detail/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail/:id', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'metrics', component: MetricsComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/people', pathMatch: 'full' },
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
