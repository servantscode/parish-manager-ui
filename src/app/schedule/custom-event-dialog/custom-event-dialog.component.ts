import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { distinctUntilChanged  } from 'rxjs/operators';
import { addSeconds } from 'date-fns';

import { Event } from '../event';

@Component({
  selector: 'app-custom-event-dialog',
  templateUrl: './custom-event-dialog.component.html',
  styleUrls: ['./custom-event-dialog.component.scss']
})
export class CustomEventDialogComponent implements OnInit {

  private meetingLength = 0;

  form = this.fb.group({
      startTime: [this.data.event.startTime, Validators.required],
      endTime: [this.data.event.endTime, Validators.required],
      reservations: [this.data.event.reservations]
    });

  constructor(public dialogRef: MatDialogRef<CustomEventDialogComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: {
                event: Event
              }) { }

  ngOnInit() {
    this.meetingLength = (this.data.event.endTime.getTime() - this.data.event.startTime.getTime())/1000;

    this.form.get('startTime').valueChanges      
      .pipe(distinctUntilChanged())
      .subscribe( start => {
        if(!start) return;

        const end = addSeconds(start, this.meetingLength);
        if(!end) return;

        this.form.get('endTime').setValue(end);
      });

    this.form.get('endTime').valueChanges      
      .pipe(distinctUntilChanged())
      .subscribe( end => {
        if(!end || end == this.form.get('endTime').value) return;

        var start = this.form.get('startTime').value;
        if(!start) return;

        this.meetingLength = (end.getTime() - start.getTime())/1000;
      });
  }

  save() {
    const formData = this.form.value;
    var event = this.data.event;
    event.startTime = formData.startTime;
    event.endTime = formData.endTime;
    event.reservations = formData.reservations;
    this.dialogRef.close(event);
  }

  close() {
    this.dialogRef.close(null);
  }
}
