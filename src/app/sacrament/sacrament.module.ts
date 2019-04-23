import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { SacramentRoutingModule } from './sacrament-routing.module';

import { BaptismComponent } from './baptism/baptism.component';
import { IdentityPickerComponent } from './identity-picker/identity-picker.component';
import { BaptismDetailsComponent } from './baptism-details/baptism-details.component';
import { BaptismFormComponent } from './baptism-form/baptism-form.component';
import { NotationsComponent } from './notations/notations.component';
import { ConfirmationFormComponent } from './confirmation-form/confirmation-form.component';
import { ConfirmationDetailsComponent } from './confirmation-details/confirmation-details.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SacramentsComponent } from './sacraments/sacraments.component';

@NgModule({
  declarations: [
    BaptismComponent,
    IdentityPickerComponent,
    BaptismDetailsComponent,
    BaptismFormComponent,
    NotationsComponent,
    ConfirmationFormComponent,
    ConfirmationDetailsComponent,
    ConfirmationComponent,
    SacramentsComponent
  ],
  imports: [
    SacramentRoutingModule,

    SCCommonModule,

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
    SacramentsComponent
  ]
})
export class SacramentModule { }
