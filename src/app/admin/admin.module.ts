import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { AdminRoutingModule } from './admin-routing.module';
import { SCCommonModule } from '../sccommon/sccommon.module';

import { RoleComponent } from './role/role.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

import { RoleService } from './services/role.service';

@NgModule({
  declarations: [
    RoleComponent,
    RoleDialogComponent
  ],
  imports: [
    AdminRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Material
    MatDialogModule,
    MatInputModule
  ],
  providers: [
    RoleService
  ],
  entryComponents: [
    RoleDialogComponent
  ]
})
export class AdminModule { }
