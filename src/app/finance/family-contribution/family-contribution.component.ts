import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { startOfWeek, startOfMonth, startOfYear } from 'date-fns';

import { DownloadService, LoginService, FamilyService } from 'sc-common';

import { FundService } from '../services/fund.service';

import { FamilyContributionService } from '../services/family-contribution.service';
import {DonationService } from '../services/donation.service';

@Component({
  selector: 'app-family-contribution',
  templateUrl: './family-contribution.component.html',
  styleUrls: ['./family-contribution.component.scss']
})
export class FamilyContributionComponent implements OnInit {

  public view:string = "YEAR";
  public viewFilter:string = ""; //this.calcFilter(startOfYear(new Date()));
  public filterChanges = new Subject<string>();

  private search:string = "";

  public donationTypes = this.donationService.getDonationTypes.bind(this.donationService);

  constructor(public contributionService: FamilyContributionService,
              public donationService: DonationService,
              public loginService: LoginService,
              private downloadService: DownloadService,
              public fundService: FundService,
              public familyService: FamilyService) { }

  ngOnInit() { }

  processUpdate(search:string) {
    this.search = search;
  }

  setView(timeframe: string) {
    this.view = timeframe;
    if(timeframe === "WEEK")
      this.setFilter(startOfWeek(new Date()));
    else if(timeframe === "MONTH")
      this.setFilter(startOfMonth(new Date()));
    else if(timeframe === "YEAR")
      this.setFilter(startOfYear(new Date()));
    else {
      this.viewFilter = "";
      this.filterChanges.next(this.viewFilter);
    }
  }

  private setFilter(startDate: Date, endDate?: Date) {
    // this.viewFilter = this.calcFilter(startDate, endDate);
    this.filterChanges.next(this.viewFilter);
  }

  private calcFilter(startDate: Date, endDate?: Date): string {
    var filter =  "donationDate:[";
    filter += startDate? formatDate(startDate, "yyyy-MM-dd", "en_US"): "*";
    filter += " TO ";
    filter += endDate? formatDate(endDate, "yyyy-MM-dd", "en_US"): "*";
    filter += "]"
    return filter;
  }

  downloadReport() {
    const filename = "family-contribution-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.contributionService.getReport(this.search), filename);
  }
}
