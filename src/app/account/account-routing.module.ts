import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: 'account/reset', component: PasswordResetComponent },
  { path: 'account/reset/:token', component: PasswordResetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
