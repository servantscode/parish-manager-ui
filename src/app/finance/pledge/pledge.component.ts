import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router'
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

  public pledgeStatuses = this.pledgeService.getPledgeStatuses.bind(this.pledgeService);
  public pledgeTypes = this.pledgeService.getPledgeTypes.bind(this.pledgeService);
  public pledgeFrequencies = this.pledgeService.getPledgeFrequencies.bind(this.pledgeService);

  private search:string = "";

  constructor(private route: ActivatedRoute,
              public pledgeService: PledgeService,
              public loginService: LoginService,
              public downloadService: DownloadService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.search = params['search']? params['search']: '');
  }

  downloadReport() {
    const filename = "pledge-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.pledgeService.getReport(this.search), filename);
  }
}
