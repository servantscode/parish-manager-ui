import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from '../../sccommon/services/login.service';

import { EventService } from '../../schedule/services/event.service';
import { Event }from '../../schedule/event';

import { LinkSessionDialogComponent } from '../link-session-dialog/link-session-dialog.component';

import { SessionService } from '../services/session.service';

import { Session } from '../formation';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  activeProgram: number;
  upcomingSessions: Session[];

  constructor(public loginService: LoginService,
              public eventService: EventService,
              public sessionService: SessionService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');

    this.loadSessions();
  }

  private loadSessions() {
    this.sessionService.getPage(0, -1, '', {"programId": this.activeProgram})
        .subscribe(resp => this.upcomingSessions = resp.results);
  }

  linkSessions() {
    const ref = this.dialog.open(LinkSessionDialogComponent, {
      width: '400px',
      data: { "programId": this.activeProgram }
    });

    ref.afterClosed().subscribe(result => {
      this.loadSessions();
    });
  }
}
