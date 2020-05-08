import { Component, OnChanges, Input } from '@angular/core';
import { FormBuilder, Validator } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { LoginService, SectionService } from 'sc-common';
import { Section, Session } from 'sc-common';

import { EventService } from '../../sccommon/services/event.service';
import { Event }from '../../sccommon/event';

import { LinkSessionDialogComponent } from '../link-session-dialog/link-session-dialog.component';
import { SectionDialogComponent } from '../section-dialog/section-dialog.component';

import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnChanges {

  @Input('section') activeSection: Section;

  activeProgramId: number;
  upcomingSessions: Session[];

  events = [];

  modifySchedule = false;

  eventForm = this.fb.group({event: ''});

  constructor(private fb: FormBuilder,
              public loginService: LoginService,
              public eventService: EventService,
              public sectionService: SectionService,
              public sessionService: SessionService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnChanges() {
    this.activeProgramId = +this.route.snapshot.paramMap.get('id');
    this.loadSessions();
  }

  private loadSessions() {
    if(this.activeSection) {
      this.sessionService.getPage(0, -1, '', {"programId": this.activeProgramId, "sectionId": this.activeSection.id})
          .subscribe(resp => {
            this.upcomingSessions = resp.results;
            const ids = resp.results.map(s => s.eventId);
            if(ids && ids.length > 0)
              this.eventService.getByIds(ids).subscribe(e => this.events = e);
          });
    }
  }

  private storeEvent() {
    const event = this.eventForm.value.event;
    const recurrence = event.recurrence;

    // if(this.getValue("id") > 0) {
    //   if(!this.loginService.userCan("event.update"))
    //     this.goBack();

    //   if(this.isCustomRecurrence()) {
    //     const cleanEvents = this.customEvents.map(e => {
    //       const ev = this.cleaningService.prune(e, new Event().asTemplate());
    //       if(ev.reservations)
    //         ev.reservations = ev.reservations.map(res => this.cleaningService.prune(res, new Reservation().asTemplate()));
    //       return ev;
    //     });
    //     this.eventService.updateSeries(cleanEvents).
    //       subscribe(() => this.goBack());
    //   } else {
    //     this.eventService.update(this.getEventFromForm()).
    //       subscribe(() => this.goBack());
    //   }
    // } else {
      if(!this.loginService.userCan("event.create"))
        this.cancel();

      if(recurrence && recurrence.cycle === 'CUSTOM') {
        alert("Can't do custom recurrences.");
        // const cleanEvents = this.customEvents.map(e => {
        //   const ev = this.cleaningService.prune(e, new Event().asTemplate());
        //   if(ev.reservations)
        //     ev.reservations = ev.reservations.map(res => this.cleaningService.prune(res, new Reservation().asTemplate()));
        //   return ev;
        // });
        // this.eventService.createSeries(cleanEvents).
        //   subscribe(() => this.cancel());
      } else {
        this.eventService.create(event).subscribe(ev => this.linkToEvent(ev));
      }
    // }
  }

  linkToEvent(event: Event) {
    this.activeSection.recurrenceId = event.recurrence.id;
    this.sectionService.update(this.activeSection, {"programId": this.activeProgramId}).subscribe(resp => {
        this.cancel();
        this.loadSessions()
      });
  }


  cancel() {
    this.modifySchedule = false;
  }


  schedule() {
    this.modifySchedule = true;
  }
}
