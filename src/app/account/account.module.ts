import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { AccountRoutingModule } from './account-routing.module';

import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RequestResetComponent } from './request-reset/request-reset.component';

@NgModule({
  declarations: [PasswordResetComponent, RequestResetComponent],
  imports: [
    AccountRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    //Material
    MatInputModule
  ]
})
export class AccountModule { }
