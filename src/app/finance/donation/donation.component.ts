import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

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

  private search:string = "";
  public totalValue: number = 0;

  constructor(public donationService: DonationService,
              public loginService: LoginService,
              private downloadService: DownloadService) { }

  ngOnInit() {
    this.donationService.getTotal(this.search).subscribe(v => this.totalValue=v);
  }

  updateSearch(search:string) {
    this.search = search;
    this.donationService.getTotal(search).subscribe(v => this.totalValue=v);
  }

  downloadReport() {
    const filename = "donation-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.donationService.getReport(this.search), filename);
  }
}
