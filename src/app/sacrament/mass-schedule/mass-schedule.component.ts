import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService, MessageService } from 'sc-common';

import { EventService } from '../../sccommon/services/event.service';
import { Event } from '../../sccommon/event';

import { MassIntentionDialogComponent } from '../mass-intention-dialog/mass-intention-dialog.component';
import { MassIntentionService } from '../services/mass-intention.service';

import { MassIntention } from '../sacrament';


@Component({
  selector: 'app-mass-schedule',
  templateUrl: './mass-schedule.component.html',
  styleUrls: ['./mass-schedule.component.scss']
})
export class MassScheduleComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public messageService: MessageService,
              public loginService: LoginService,
              private eventService: EventService,
              private massIntentionService: MassIntentionService) { }

  masses: Event[];

  boundLoadMasses = this.loadMasses.bind(this);
  boundEditIntention = this.editIntention.bind(this);

  private lastStart: Date;
  private lastEnd: Date;

  ngOnInit() {
  }

  loadMasses(start:Date, end:Date) {
    this.lastStart = start;
    this.lastEnd = end;

    const search = this.eventService.timeRangeQuery("", start, end);
    this.eventService.getMasses(0, -1, search).subscribe(results => {
      this.masses = results.results;
      const massSearch = `massTime:[${start.toISOString()} TO ${end.toISOString()}]`;
      this.massIntentionService.getPage(0, -1, massSearch).subscribe(resp => {
        for(let intention of resp.results) {
          const mass: any = this.masses.find(m => m.id == intention.eventId);
          if(mass) {
            mass.intention = intention;
            if(!mass.additionalDetails)
              mass.additionalDetails = [];
            mass.additionalDetails.push("for " + intention.person.name + (intention.intentionType == "DECEASED"? " †": ""));
            mass.additionalDetails.push("requested by " + intention.requester.name);
          }
        }
      });
    });
  }

  reloadMasses() {
    this.loadMasses(this.lastStart, this.lastEnd);
  }

  editIntention(event: Event) {
    const e: any = event;
    var intention = e.intention;
    if(!intention) {
      intention = new MassIntention();
      intention.eventId = e.id;
    }

    const dialogRef = this.dialog.open(MassIntentionDialogComponent, {
        width: '400px',
        data: {item: intention}
      });

    dialogRef.afterClosed().subscribe(intention => {
        if(intention)
          e.intention = intention;
          e.additionalDetails = [];
          e.additionalDetails.push("for " + intention.person.name + (intention.intentionType == "DECEASED"? " †": " (sp)"));
          e.additionalDetails.push("requested by " + intention.requester.name);
      });
  }
}
