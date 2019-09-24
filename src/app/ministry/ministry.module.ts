import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';
import { MinistryMemberListComponent } from './ministry-member-list/ministry-member-list.component';

import { MinistryService } from './services/ministry.service';
import { EnrollmentService } from './services/enrollment.service';

import { MinistryRoutingModule } from './ministry-routing.module';
import { MinistryRoleDialogComponent } from './ministry-role-dialog/ministry-role-dialog.component';
import { MinistryRoleComponent } from './ministry-role/ministry-role.component';

@NgModule({
  declarations: [
    MinistryListComponent,
    MinistryDetailComponent,
    MinistryMemberListComponent,
    MinistryRoleDialogComponent,
    MinistryRoleComponent
  ],
  imports: [
    MinistryRoutingModule,

    SCCommonModule,
    ScCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Bootstrap
    NgbModule,

    //Material
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [
    MinistryMemberListComponent
  ],
  providers: [
    MinistryService,
    EnrollmentService
  ],
  entryComponents: [
    MinistryRoleDialogComponent
  ]
})
export class MinistryModule { }
