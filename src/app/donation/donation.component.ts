import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ChartData } from '../chartData';
import { DonationReport } from '../donation-report';
import { MetricsService } from '../services/metrics.service';
import { ColorService } from '../services/color.service';
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

  constructor(private metricsService: MetricsService,
              private colorService: ColorService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.updateMetrics();
  }

  updateMetrics() {
    this.metricsService.getPledgeFulfillments().
      subscribe(results => {
        this.annualPledgeTotal = results.totalPledges;
        this.ytdDonations = results.donationsToDate;
        const projectedDonations = results.totalPledges * this.dayOfYear()/this.daysInYear();
        this.vsProjection = results.donationsToDate - projectedDonations;
        this.pledgeFulfillment = new ChartData(results.data, this.colorService.trafficLight());
      });

    this.metricsService.getMonthlyDonations().
      subscribe(results => this.monthlyDonations = results );
  }

  public openDonationForm() {
    const donationRef = this.dialog.open(BulkDonationDialogComponent, {
      width: '800px'
    });

    donationRef.afterClosed().subscribe(result => {
      this.updateMetrics();
    });
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