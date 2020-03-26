import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from 'sc-common';

import { AttendanceDialogComponent } from '../attendance-dialog/attendance-dialog.component';

import { AttendanceService } from '../services/attendance.service';

import { AttendanceReport, AttendanceRecord } from '../attendance';
import { Classroom } from '../formation';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnChanges {
  @Input() classroom: Classroom;

  attendance: AttendanceReport;

  constructor(private dialog: MatDialog,
              public attendanceService: AttendanceService,
              public loginService: LoginService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.attendanceService.getAttendance(this.classroom.programId, this.classroom.id).subscribe(a => this.attendance=a);
  }

  countAttendance(student: AttendanceRecord): number {
    var attendance = 0;
    for(let key of Object.keys(student.sessionAttendance)) {
      if(student.sessionAttendance[key])
        attendance++;
    }
    return attendance;
  }

  determinePresence(attendance: any, sessionId: number): string {
    return !(sessionId in attendance)?
          "":
          attendance[sessionId]? 
            "present": 
            "absent";
  }

  recordAttendance() {
    const attendanceRef = this.dialog.open(AttendanceDialogComponent, {
      width: '400px',
      data: {"programId": this.classroom.programId,
             "classroomId": this.classroom.id,
             "enrolleeIds": this.attendance.attendance.map(a => a.enrolleeId),
             "enrolleeNames": this.attendance.attendance.map(a => a.enrolleeName)
        }
    });

    attendanceRef.afterClosed().subscribe(result => {
      if(result)
        this.attendance=result;
    });

  }
}
