import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { isAfter } from 'date-fns';

import { CustomControl } from '../../sccommon/custom-control';

import { CheckinService } from '../services/checkin.service';
import { CheckinDialogComponent } from '../checkin-dialog/checkin-dialog.component';

import { Checkin } from '../checkin'

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  CheckinDialogComponent=CheckinDialogComponent;

  activeCheckins = this.checkinService.getActiveCheckins.bind(this.checkinService);

  refreshList = new Subject<any>();

  controls: CustomControl<Checkin>[] = [
    new CustomControl("checkin", 
      (item: Checkin) => {
      if(!item)
        return;

      const openDialog = this.dialog.open(CheckinDialogComponent, {
        width: '400px',
        data: {"item": {'personId': item.personId}}
      });

      openDialog.afterClosed().subscribe(result => {
          this.refreshList.next();
        });
    },
    (item: Checkin) => {
      return isAfter(new Date(), item.expiration);
    })
  ];

  constructor(private dialog: MatDialog,
              public checkinService: CheckinService) { }

  ngOnInit() {
  }
}
