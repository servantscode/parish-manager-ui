import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { SacramentRoutingModule } from './sacrament-routing.module';

import { BaptismComponent } from './baptism/baptism.component';
import { BaptismDetailsComponent } from './baptism-details/baptism-details.component';
import { BaptismFormComponent } from './baptism-form/baptism-form.component';
import { NotationsComponent } from './notations/notations.component';
import { ConfirmationFormComponent } from './confirmation-form/confirmation-form.component';
import { ConfirmationDetailsComponent } from './confirmation-details/confirmation-details.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SacramentsComponent } from './sacraments/sacraments.component';
import { MarriageComponent } from './marriage/marriage.component';
import { MarriageDetailsComponent } from './marriage-details/marriage-details.component';
import { MarriageFormComponent } from './marriage-form/marriage-form.component';
import { MassIntentionComponent } from './mass-intention/mass-intention.component';
import { MassIntentionDialogComponent } from './mass-intention-dialog/mass-intention-dialog.component';

@NgModule({
  declarations: [
    BaptismComponent,
    BaptismDetailsComponent,
    BaptismFormComponent,
    NotationsComponent,
    ConfirmationFormComponent,
    ConfirmationDetailsComponent,
    ConfirmationComponent,
    SacramentsComponent,
    MarriageComponent,
    MarriageDetailsComponent,
    MarriageFormComponent,
    MassIntentionComponent,
    MassIntentionDialogComponent
  ],
  imports: [
    SacramentRoutingModule,

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
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule
  ],
  exports: [
    SacramentsComponent,
    MassIntentionComponent
  ],
  entryComponents: [
    MassIntentionDialogComponent
  ]
})
export class SacramentModule { }
