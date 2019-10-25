import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { startOfWeek, startOfMonth, startOfYear } from 'date-fns';

import { DownloadService, LoginService } from 'sc-common';

import { PledgeService } from '../services/pledge.service';
import { PledgeDialogComponent } from '../pledge-dialog/pledge-dialog.component';

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.scss']
})
export class PledgeComponent implements OnInit {

  PledgeDialogComponent=PledgeDialogComponent;

  private search:string = "";

  constructor(public pledgeService: PledgeService,
              public loginService: LoginService,
              public downloadService: DownloadService) { }

  ngOnInit() {
  }

  updateSearch(search:string) {
    this.search = search;
  }

  downloadReport() {
    const filename = "pledge-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.pledgeService.getReport(this.search), filename);
  }
}
