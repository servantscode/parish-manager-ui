import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { AdminRoutingModule } from './admin-routing.module';

import { CredentialDialogComponent } from './credential-dialog/credential-dialog.component';
import { PermissionTreeComponent } from './permission-tree/permission-tree.component';
import { RoleComponent } from './role/role.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

import { RoleService } from './services/role.service';
import { AdminTabsComponent } from './admin-tabs/admin-tabs.component';
import { UserAccessComponent } from './user-access/user-access.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { EmailConfigComponent } from './email-config/email-config.component';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';
import { PreferenceDialogComponent } from './preference-dialog/preference-dialog.component';
import { ParishDetailsComponent } from './parish-details/parish-details.component';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { IntegrationComponent } from './integration/integration.component';
import { IntegrationDialogComponent } from './integration-dialog/integration-dialog.component';
import { AutomationDialogComponent } from './automation-dialog/automation-dialog.component';

@NgModule({
  declarations: [
    CredentialDialogComponent,
    PermissionTreeComponent,
    RoleComponent,
    RoleDialogComponent,
    AdminTabsComponent,
    UserAccessComponent,
    PasswordDialogComponent,
    EmailConfigComponent,
    PreferenceConfigComponent,
    PreferenceDialogComponent,
    ParishDetailsComponent,
    DepartmentDialogComponent,
    CategoryDialogComponent,
    IntegrationComponent,
    IntegrationDialogComponent,
    AutomationDialogComponent
  ],
  imports: [
    AdminRoutingModule,

    SCCommonModule,
    ScCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Material
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSelectModule
  ],
  exports: [
  ],
  providers: [
    RoleService
  ],
  entryComponents: [
    CredentialDialogComponent,
    RoleDialogComponent,
    PasswordDialogComponent,
    PreferenceDialogComponent,
    DepartmentDialogComponent,
    CategoryDialogComponent,
    IntegrationDialogComponent,
    AutomationDialogComponent
  ]
})
export class AdminModule { }
