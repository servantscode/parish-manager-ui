import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from 'sc-common';

import { EventService } from '../../schedule/services/event.service';
import { Event }from '../../schedule/event';

import { LinkSessionDialogComponent } from '../link-session-dialog/link-session-dialog.component';
import { SectionDialogComponent } from '../section-dialog/section-dialog.component';

import { SessionService } from '../services/session.service';
import { SectionService } from '../services/section.service';

import { Section, Session } from '../formation';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, OnChanges {

  @Input('section') activeSection: Section;

  activeProgramId: number;
  upcomingSessions: Session[];

  constructor(public loginService: LoginService,
              public eventService: EventService,
              public sectionService: SectionService,
              public sessionService: SessionService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.activeProgramId = +this.route.snapshot.paramMap.get('id');

    this.loadSessions();
  }

  ngOnChanges() {
    this.activeProgramId = +this.route.snapshot.paramMap.get('id');

    this.loadSessions();
  }

  private loadSessions() {
    this.sessionService.getPage(0, -1, '', {"programId": this.activeProgramId, "sectionId": this.activeSection.id})
        .subscribe(resp => this.upcomingSessions = resp.results);
  }

  linkSessions() {
    const ref = this.dialog.open(LinkSessionDialogComponent, {
      width: '400px',
      data: { "section": this.activeSection }
    });

    ref.afterClosed().subscribe(result => {
      this.loadSessions();
    });
  }
}
