import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SCCommonModule } from '../sccommon/sccommon.module';

import { FinanceRoutingModule } from './finance-routing.module';

import { BulkDonationDialogComponent } from './bulk-donation-dialog/bulk-donation-dialog.component';
import { DonationComponent } from './donation/donation.component';
import { DonationDialogComponent } from './donation-dialog/donation-dialog.component';
import { PledgeDialogComponent } from './pledge-dialog/pledge-dialog.component';

import { DonationService } from './services/donation.service';
import { PledgeService } from './services/pledge.service';

@NgModule({
  declarations: [
    BulkDonationDialogComponent,
    DonationComponent,
    DonationDialogComponent,
    PledgeDialogComponent
  ],
  imports: [
    FinanceRoutingModule,

    SCCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Material
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,

    //Charts
    NgxChartsModule
  ],
  providers: [
    DonationService,
    PledgeService
  ],
  entryComponents: [
    DonationDialogComponent, 
    PledgeDialogComponent, 
    BulkDonationDialogComponent
  ]
})
export class FinanceModule { }
