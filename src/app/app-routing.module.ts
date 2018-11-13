import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';

const routes: Routes = [
  { path: 'people', component: PeopleListComponent },
  { path: 'person/detail', component: PersonDetailComponent },
  { path: 'person/detail/:id', component: PersonDetailComponent },
  { path: 'family/detail', component: FamilyDetailComponent },
  { path: 'family/detail/:id', component: FamilyDetailComponent },
  { path: 'ministries', component: MinistryListComponent },
  { path: 'ministry/detail', component: MinistryDetailComponent },
  { path: 'ministry/detail/:id', component: MinistryDetailComponent },
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  { path: '**', component: PeopleListComponent }
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
