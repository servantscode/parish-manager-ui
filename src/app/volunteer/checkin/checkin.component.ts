import { Component, OnInit } from '@angular/core';

import { CheckinService } from '../services/checkin.service';
import { CheckinDialogComponent } from '../checkin-dialog/checkin-dialog.component';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  CheckinDialogComponent=CheckinDialogComponent;

  activeCheckins = this.checkinService.getActiveCheckins.bind(this.checkinService);

  constructor(public checkinService: CheckinService) { }

  ngOnInit() {
  }
}
