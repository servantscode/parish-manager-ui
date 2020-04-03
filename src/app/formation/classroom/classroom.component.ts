import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DownloadService, LoginService } from 'sc-common';

import { ClassroomDialogComponent } from '../classroom-dialog/classroom-dialog.component';
import { EmailDialogComponent } from '../../sccommon/email-dialog/email-dialog.component';

import { ClassroomService } from '../services/classroom.service';
import { ProgramService } from '../services/program.service';

import { Classroom } from '../formation';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {

  ClassroomDialogComponent = ClassroomDialogComponent;

  activeProgram: number;

  selectedClassroom: Classroom;

  constructor(public classroomService: ClassroomService,
              public downloadService: DownloadService,
              public programService: ProgramService,
              public loginService: LoginService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');
  }

  classroomSelected(classsroom: Classroom) {
    this.selectedClassroom = classsroom;
  }

  downloadAttendanceSheets() {
    const filename = "attendanceSheets-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".pdf";
    this.downloadService.downloadReport(this.programService.getAttendanceSheets(this.activeProgram), filename);
  }

  openMailDialog(): void {
    if(!this.loginService.userCan('email.send'))
      return;

    const emailRef = this.dialog.open(EmailDialogComponent, {
      width: '800px', 
      data: {"to": this.selectedClassroom.instructorEmails}
    });
  }
}
