import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonComponent } from './person/person.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';

const routes: Routes = [
  { path: 'person', component: PersonComponent },
  { path: 'person/detail', component: PersonDetailComponent },
  { path: 'person/detail/:id', component: PersonDetailComponent },
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
