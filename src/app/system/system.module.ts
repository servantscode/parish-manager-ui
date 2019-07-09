import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { SystemRoutingModule } from './system-routing.module';
import { SystemTabsComponent } from './system-tabs/system-tabs.component';
import { OrganizationComponent } from './organization/organization.component';
import { OrganizationDialogComponent } from './organization-dialog/organization-dialog.component';

@NgModule({
  declarations: [
    SystemTabsComponent, 
    OrganizationComponent, OrganizationDialogComponent
  ],
  imports: [
    SystemRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    //Material
    MatDialogModule,
    MatInputModule,
    MatToolbarModule
  ],
  entryComponents: [
    OrganizationDialogComponent
  ]
})
export class SystemModule { }
