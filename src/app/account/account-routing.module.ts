import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RequestResetComponent } from './request-reset/request-reset.component';

const routes: Routes = [
  { path: 'forgot', component: RequestResetComponent },
  { path: 'account/reset', component: PasswordResetComponent },
  { path: 'account/reset/:token', component: PasswordResetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
