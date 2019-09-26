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

  private search:string;

  constructor(public donationService: DonationService,
              public loginService: LoginService,
              private downloadService: DownloadService) { }

  ngOnInit() {}

  updateSearch(search:string) {
    this.search = search;
  }

  downloadReport() {
    const filename = "donation-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.donationService.getReport(this.search), filename);
  }
}
