import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { AttendanceService } from '../services/attendance.service';
import { ClassroomService } from '../services/classroom.service';
import { SessionService } from '../services/session.service';

import { SessionAttendance } from '../attendance';


@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance-dialog.component.scss']
})
export class AttendanceDialogComponent implements OnInit {
  form = this.fb.group({
      programId: [0, Validators.required],
      classroomId: [0, Validators.required],
      sessionId: [0, Validators.required],
      selectAll: [false],
      enrolleeAttendance: this.fb.array([])
    });

  constructor(public dialogRef: MatDialogRef<AttendanceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                programId: number,
                classroomId: number,
                sessionId: number,
                enrolleeIds: number[],
                enrolleeNames: string[]
              },
              private fb: FormBuilder,
              private attendanceService: AttendanceService,
              public classroomService: ClassroomService,
              public sessionService: SessionService) { }
  
  ngOnInit() {
    if(this.data.enrolleeIds.length != this.data.enrolleeNames.length) {
      alert("Incongruent enrollee data! " + JSON.stringify(this.data));
      this.cancel();
    }

    this.form.get('programId').setValue(this.data.programId);
    this.form.get('classroomId').setValue(this.data.classroomId);
    this.form.get('sessionId').setValue(this.data.sessionId);

    const control = this.enrolleeControls();

    for(let id of this.data.enrolleeIds)
      control.push(this.newRow(id));

    this.form.get('selectAll').valueChanges.subscribe(checked => this.selectAll(checked));

  }

  enrolleeControls(): FormArray {
    return <FormArray>this.form.controls['enrolleeAttendance'];
  }

  selectAll(checked: boolean) {
    for( let row of this.enrolleeControls().controls) {
      row.get('attended').setValue(checked);
    }
  }

  newRow(enrolleeId: number) {
    return this.fb.group({
      enrolleeId: [enrolleeId, Validators.required],
      attended: false
    });
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const attendance: SessionAttendance = this.formatAttendanceRequest(this.form.value);

    this.attendanceService.saveSessionAttendance(attendance).
      subscribe(updatedAttendance => {
        this.dialogRef.close(updatedAttendance);
      });
  }

  cancel() {
    this.dialogRef.close();    
  }

  formatAttendanceRequest(data: any): SessionAttendance {
    var attendance = new SessionAttendance();
    attendance.programId = data.programId;
    attendance.classroomId = data.classroomId;
    attendance.sessionId = data.sessionId;
    attendance.enrolleeAttendance = {}
    for(let personAttended of data.enrolleeAttendance) {
      const id = personAttended.enrolleeId;
      const attended = personAttended.attended;
      attendance.enrolleeAttendance[id]=attended;
    }
    return attendance;
  }
}
