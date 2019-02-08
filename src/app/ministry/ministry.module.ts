import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';
import { MinistryMemberListComponent } from './ministry-member-list/ministry-member-list.component';

import { MinistryService } from './services/ministry.service';
import { EnrollmentService } from './services/enrollment.service';

import { MinistryRoutingModule } from './ministry-routing.module';

@NgModule({
  declarations: [
    MinistryListComponent,
    MinistryDetailComponent,
    MinistryMemberListComponent
  ],
  imports: [
    MinistryRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Bootstrap
    NgbModule,

    //Material
    MatInputModule,
    MatAutocompleteModule
    // MatCheckboxModule
  ],
  exports: [
    MinistryMemberListComponent,
  ],
  providers: [
    MinistryService,
    EnrollmentService
  ]
})
export class MinistryModule { }
