import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';
import { DonationComponent } from './donation/donation.component';
import { MetricsComponent } from './metrics/metrics.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'people', component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: 'person/detail', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person/detail/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail/:id', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'ministries', component: MinistryListComponent, canActivate: [AuthGuard] },
  { path: 'ministry/detail', component: MinistryDetailComponent, canActivate: [AuthGuard] },
  { path: 'ministry/detail/:id', component: MinistryDetailComponent, canActivate: [AuthGuard] },
  { path: 'metrics', component: MetricsComponent, canActivate: [AuthGuard] },
  { path: 'donations', component: DonationComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/people', pathMatch: 'full' },
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
