import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { startOfWeek, startOfMonth, startOfYear } from 'date-fns';

import { DownloadService, LoginService } from 'sc-common';

import { DonationService } from '../services/donation.service';
import { DonationDialogComponent } from '../donation-dialog/donation-dialog.component';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {

  DonationDialogComponent = DonationDialogComponent;

  public view:string = "YEAR";
  public viewFilter:string = this.calcFilter(startOfYear(new Date()));
  public filterChanges = new Subject<string>();

  private search:string = "";
  public totalValue: number = 0;

  constructor(public donationService: DonationService,
              public loginService: LoginService,
              private downloadService: DownloadService) { }

  ngOnInit() {
    this.updateTotal();
  }

  updateSearch(search:string) {
    this.search = search;
    this.updateTotal();
  }

  private updateTotal() {
    const activeSearch = this.search + " " + this.viewFilter;
    this.donationService.getTotal(activeSearch).subscribe(v => this.totalValue=v);
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
    this.updateTotal();
  }

  private setFilter(startDate: Date, endDate?: Date) {
    this.viewFilter = this.calcFilter(startDate, endDate);
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
    const filename = "donation-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.donationService.getReport(this.search), filename);
  }
}
