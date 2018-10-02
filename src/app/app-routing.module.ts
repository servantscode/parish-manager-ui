import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonComponent } from './person/person.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'people', component: PersonComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail', component: PersonDetailComponent },
  { path: 'detail/:id', component: PersonDetailComponent }
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
