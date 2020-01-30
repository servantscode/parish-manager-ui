import { Component, OnInit, NgZone } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { getDayOfYear, getDaysInYear } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColorService } from '../../sccommon/services/color.service';
import { DownloadService } from 'sc-common';
import { LoginService } from 'sc-common';

import { ChartData } from '../../metrics/chart-data';
import { MetricsService } from '../../metrics/services/metrics.service';

import { DonationTierReport } from '../../metrics/donation-tier-report';

import { FundService } from '../services/fund.service';

import { MonthlyDonations } from '../donation-report';
import { BulkDonationDialogComponent } from '../bulk-donation-dialog/bulk-donation-dialog.component';

@Component({
  selector: 'app-donation-overview',
  templateUrl: './donation-overview.component.html',
  styleUrls: ['./donation-overview.component.scss']
})
export class DonationOverviewComponent implements OnInit {
  ytdDonations: number;
  pledgedDonations: number;
  unpledgedDonations: number;
  pledgeFulfillmentPct: number;
  pledgeFulfillment: ChartData = new ChartData(null, ['#2222dd']);
  monthlyDonations: MonthlyDonations[];
  fyStart: Date;
  fyEnd: Date;

  tierReport: DonationTierReport;

  fundForm = this.fb.group({
      fundId: ''
    });

  annualReportForm = this.fb.group({
    year: "" + (new Date().getFullYear() - 1)
  });

  availableYears = this.getAvailableYears.bind(this);

  getAvailableYears():Observable<string[]> {
    return this.metricsService.availableDonationTierReports().pipe(
        map(values => values.map(y => "" + y))
      );
  }


  constructor(private zone: NgZone,
              private router: Router,
              private metricsService: MetricsService,
              private colorService: ColorService,
              private downloadService: DownloadService,
              public loginService: LoginService,
              public fundService: FundService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.updateMetrics();

    this.fundForm.get('fundId').valueChanges.subscribe(() => this.updateMetrics());

    this.annualReportForm.get("year").valueChanges.subscribe(value => this.updateDonationTierReport(value));
  }

  updateMetrics() {
    if(this.loginService.userCan('pledge.metrics'))
      this.metricsService.getPledgeFulfillments(this.getFundId()).subscribe(results => {
          this.pledgeFulfillmentPct = results.pledgedDonations/results.pledgedTarget;
          this.pledgeFulfillment = new ChartData(results.data, this.colorService.trafficLight());
        });

      this.metricsService.getYtdDonations(this.getFundId()).subscribe(results => {
          this.ytdDonations = results.totalDonations;
          this.pledgedDonations = results.pledged;
          this.unpledgedDonations = results.unpledged;
          this.fyStart = results.startDate;
          this.fyEnd = results.endDate;
        });
    
    this.updateDonationTierReport(this.annualReportForm.get("year").value);
    this.updateDonations();
  }

  updateDonationTierReport(year) {
      this.metricsService.getDonationTierReport(year).subscribe(result => this.tierReport = result);
  }


  public clicked(event: any) {
    if(event.name == 'Unpledged')
      return;

    const search = 'pledgeStatus:' + event.name.toUpperCase().replace(/\s/, '_');
    const navExtras: NavigationExtras = {queryParams: { search: search } };
    this.router.navigate(['/finance/pledges'], navExtras);
  }

  private updateDonations() {
    if(this.loginService.userCan('donation.metrics'))
      this.metricsService.getMonthlyDonations(this.getFundId()).
        subscribe(results => this.monthlyDonations = results );
  }

  private getFundId() {
    return this.fundForm.get('fundId').value;
  }

  downloadReport() {
    const filename = "donation-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.metricsService.getMonthlyDonationReport(this.fundForm.get('fundId').value), filename);
  }
}
