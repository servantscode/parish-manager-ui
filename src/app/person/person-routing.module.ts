import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonTabsComponent } from './person-tabs/person-tabs.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { RegistrationReviewComponent } from './registration-review/registration-review.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'person', component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: 'person/new', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person/:id', component: PersonTabsComponent, canActivate: [AuthGuard] },
  { path: 'person/:id/:tab', component: PersonTabsComponent, canActivate: [AuthGuard] },
  { path: 'family/detail', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail/:id', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/registration', component: RegistrationReviewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
