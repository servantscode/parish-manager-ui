import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { AdminRoutingModule } from './admin-routing.module';

import { CredentialDialogComponent } from './credential-dialog/credential-dialog.component';
import { PermissionTreeComponent } from './permission-tree/permission-tree.component';
import { RoleComponent } from './role/role.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';

import { RoleService } from './services/role.service';

@NgModule({
  declarations: [
    CredentialDialogComponent,
    PermissionTreeComponent,
    RoleComponent,
    RoleDialogComponent,
    UserCredentialsComponent
  ],
  imports: [
    AdminRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Material
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule
  ],
  exports: [
    UserCredentialsComponent
  ],
  providers: [
    RoleService
  ],
  entryComponents: [
    CredentialDialogComponent,
    RoleDialogComponent
  ]
})
export class AdminModule { }
