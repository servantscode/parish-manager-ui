import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { DownloadService } from 'sc-common';

import { ClassroomDialogComponent } from '../classroom-dialog/classroom-dialog.component';

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
              private route: ActivatedRoute) { }

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
}
