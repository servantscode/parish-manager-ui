import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTooltipModule } from '@angular/material/tooltip';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { VolunteerRoutingModule } from './volunteer-routing.module';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckinDialogComponent } from './checkin-dialog/checkin-dialog.component';


@NgModule({
  declarations: [
    CheckinComponent,
    CheckinDialogComponent
  ],
  imports: [
    VolunteerRoutingModule,

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
    MatAutocompleteModule
  ],
  entryComponents: [
    CheckinDialogComponent
  ]
})
export class VolunteerModule { }
