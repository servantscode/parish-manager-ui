import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DownloadService, FamilyService, LoginService } from 'sc-common';
import { Family } from 'sc-common';

import { Donation } from '../../finance/donation';
import { Pledge } from '../../finance/pledge';
import { DonationDialogComponent } from '../../finance/donation-dialog/donation-dialog.component';
import { PledgeDialogComponent } from '../../finance/pledge-dialog/pledge-dialog.component';
import { DonationService } from '../../finance/services/donation.service';
import { PledgeService } from '../../finance/services/pledge.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-family-financial',
  templateUrl: './family-financial.component.html',
  styleUrls: ['./family-financial.component.scss']
})
export class FamilyFinancialComponent implements OnInit, OnChanges {

  DonationDialogComponent = DonationDialogComponent;

  @Input() family: Family;
  private pledges: Pledge[];

  annualReportForm = this.fb.group({
      year: "2019"
    });

  availableYears = this.getAvailableYears.bind(this);

  getAvailableYears():Observable<string[]> {
    return this.donationService.availableReports(this.family.id).pipe(
        map(values => values.map(y => "" + y))
      );
  }

  constructor(private donationService: DonationService,
              private pledgeService: PledgeService,
              public loginService: LoginService,
              public downloadService: DownloadService,
              private fb: FormBuilder,
              private dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if(this.family)
      this.loadPledges(this.family.id);
  }

  loadPledges(id: number): void {
    if(!id)
      return;

    if(!this.loginService.userCan('pledge.read'))
      return;

    this.pledgeService.getPledges(id).
      subscribe(pledges => this.pledges = pledges);
  }

  public openPledgeForm(pledge: Pledge) {
    if(!this.loginService.userCan('pledge.create'))
      return;

    var item = pledge;
    if(!item) {
      item = new Pledge();
      item.familyId=this.family.id;
    }

    const pledgeRef = this.dialog.open(PledgeDialogComponent, {
      width: '800px',
      data: {"item": item}
    });

    pledgeRef.afterClosed().subscribe(result => {
      this.loadPledges(this.family.id);
    });
  }

  deletePledge(pledge: Pledge): void {
    if(!this.loginService.userCan('pledge.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deletion",
             "text" : "Are you sure you want to delete " + pledge.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.pledgeService.delete(pledge, true); 
             },
             "actionName":"Delete",
             "nav": () => { 
               this.loadPledges(this.family.id);
             }
        }
    });
  }

  downloadAnnualReport(): void {
    const year = this.annualReportForm.get("year").value;
    const filename = `${this.family.surname}-annual-report-${year}.pdf`;
    this.downloadService.downloadPdf(this.donationService.annualReport(this.family.id, +year), filename);
  }

  canEmail(): boolean {
    return this.loginService.userCan("email.send") && this.family.members.some(p => p.headOfHousehold && p.email);
  }

  emailAnnualReport(): void {
    const year = this.annualReportForm.get("year").value;
    this.donationService.emailAnnualReport(this.family.id, year).subscribe();
  }
}
