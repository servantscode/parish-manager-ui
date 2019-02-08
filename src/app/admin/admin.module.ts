import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { AdminRoutingModule } from './admin-routing.module';

import { RoleComponent } from './role/role.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

import { RoleService } from './services/role.service';
import { PermissionTreeComponent } from './permission-tree/permission-tree.component';

@NgModule({
  declarations: [
    RoleComponent,
    RoleDialogComponent,
    PermissionTreeComponent
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
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule
  ],
  providers: [
    RoleService
  ],
  entryComponents: [
    RoleDialogComponent
  ]
})
export class AdminModule { }
