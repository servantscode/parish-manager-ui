import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'person', component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: 'person/detail', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person/detail/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail', component: FamilyDetailComponent, canActivate: [AuthGuard] },
  { path: 'family/detail/:id', component: FamilyDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
