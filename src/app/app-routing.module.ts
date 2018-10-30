import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonComponent } from './person/person.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';

const routes: Routes = [
  { path: 'person', component: PersonComponent },
  { path: 'person/detail', component: PersonDetailComponent },
  { path: 'person/detail/:id', component: PersonDetailComponent },
  { path: 'family/detail', component: FamilyDetailComponent },
  { path: 'family/detail/:id', component: FamilyDetailComponent },
  { path: '', redirectTo: '/person', pathMatch: 'full' },
  { path: '**', component: PersonComponent }
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
