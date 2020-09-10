import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { FinanceRoutingModule } from './finance-routing.module';

import { BulkDonationDialogComponent } from './bulk-donation-dialog/bulk-donation-dialog.component';
import { DonationOverviewComponent } from './donation-overview/donation-overview.component';
import { DonationComponent } from './donation/donation.component';
import { DonationDialogComponent } from './donation-dialog/donation-dialog.component';
import { PledgeDialogComponent } from './pledge-dialog/pledge-dialog.component';

import { DonationService } from './services/donation.service';
import { PledgeService } from './services/pledge.service';
import { FundComponent } from './fund/fund.component';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { FinanceTabsComponent } from './finance-tabs/finance-tabs.component';
import { RecordDonationComponent } from './record-donation/record-donation.component';
import { PledgeComponent } from './pledge/pledge.component';
import { ReviewIncomingDonationsComponent } from './review-incoming-donations/review-incoming-donations.component';
import { FamilyContributionComponent } from './family-contribution/family-contribution.component';

@NgModule({
  declarations: [
    BulkDonationDialogComponent,
    DonationOverviewComponent,
    DonationDialogComponent,
    PledgeDialogComponent,
    FundComponent,
    FundDialogComponent,
    FinanceTabsComponent,
    RecordDonationComponent,
    DonationComponent,
    PledgeComponent,
    ReviewIncomingDonationsComponent,
    FamilyContributionComponent
  ],
  imports: [
    FinanceRoutingModule,

    SCCommonModule,
    ScCommonModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Material
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatToolbarModule,

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
    BulkDonationDialogComponent,
    FundDialogComponent
  ]
})
export class FinanceModule { }
