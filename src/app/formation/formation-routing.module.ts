import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

import { ProgramComponent } from './program/program.component';
import { ProgramTabsComponent } from './program-tabs/program-tabs.component';
import { ProgramGroupComponent } from './program-group/program-group.component';

const routes: Routes = [
  { path: 'formation', component: ProgramComponent, canActivate: [AuthGuard] },
  { path: 'formation/program-groups', component: ProgramGroupComponent, canActivate: [AuthGuard] },
  { path: 'formation/:id', component: ProgramTabsComponent, canActivate: [AuthGuard] },
  { path: 'formation/:id/:tab', component: ProgramTabsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationRoutingModule { }
