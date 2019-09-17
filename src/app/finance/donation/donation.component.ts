import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

import { ColorService } from '../../sccommon/services/color.service';
import { DownloadService } from '../../sccommon/services/download.service';
import { LoginService } from 'sc-common';

import { ChartData } from '../../metrics/chart-data';
import { MetricsService } from '../../metrics/services/metrics.service';

import { FundService } from '../services/fund.service';

import { DonationReport } from '../donation-report';
import { BulkDonationDialogComponent } from '../bulk-donation-dialog/bulk-donation-dialog.component';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {
  annualPledgeTotal: number;
  ytdDonations: number;
  vsProjection: number;
  pledgeFulfillment: ChartData = new ChartData(null, ['#2222dd']);
  monthlyDonations: DonationReport[];

  fundForm = this.fb.group({
      fundId: ''
    });

  constructor(private metricsService: MetricsService,
              private colorService: ColorService,
              private downloadService: DownloadService,
              public loginService: LoginService,
              public fundService: FundService,
              private dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.updateMetrics();

    this.fundForm.get('fundId').valueChanges.subscribe(() => this.updateMetrics());
  }

  updateMetrics() {
    if(this.loginService.userCan('pledge.metrics'))
      this.metricsService.getPledgeFulfillments(this.getFundId()).
        subscribe(results => {
          this.annualPledgeTotal = results.totalPledges;
          this.ytdDonations = results.donationsToDate;
          const projectedDonations = results.totalPledges * this.dayOfYear()/this.daysInYear();
          this.vsProjection = results.donationsToDate - projectedDonations;
          this.pledgeFulfillment = new ChartData(results.data, this.colorService.trafficLight());
        });
    
    this.updateDonations();
  }

  private updateDonations() {
    if(this.loginService.userCan('donation.metrics'))
      this.metricsService.getMonthlyDonations(this.getFundId()).
        subscribe(results => this.monthlyDonations = results );
  }

  private getFundId() {
    return this.fundForm.get('fundId').value;
  }

  public openDonationForm() {
    if(!this.loginService.userCan('donation.create'))
      return;

    const donationRef = this.dialog.open(BulkDonationDialogComponent, {
      width: '800px'
    });

    donationRef.afterClosed().subscribe(result => {
      this.updateMetrics();
    });
  }

  downloadReport() {
    const filename = "donation-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.metricsService.getMonthlyDonationReport(this.fundForm.get('fundId').value), filename);
  }

  private dayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.valueOf() - start.valueOf()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  private daysInYear(): number {
    const now = new Date().getFullYear();
    var isLeapYear = (now % 4 == 0 && !(now%100 == 0)) || (now%400 == 0); //Overengineered ;)
    return isLeapYear? 366: 365;
  }
}
