import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'
import { startOfHour, addHours, setHours, setMinutes, setSeconds } from 'date-fns';

import { Event } from '../event';
import { Ministry } from '../ministry';
import { EventService } from '../services/event.service';
import { MinistryService } from '../services/ministry.service';
import { LoginService } from '../services/login.service';
import { SCValidation } from '../validation';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      startDate:[new Date(), Validators.required],
      startTime:[this.pullTime(addHours(startOfHour(new Date), 1)), [Validators.required, Validators.pattern(SCValidation.TIME)]],
      endDate:[new Date(), Validators.required],
      endTime:[this.pullTime(addHours(startOfHour(new Date), 2)), [Validators.required, Validators.pattern(SCValidation.TIME)]],
      schedulerId:[this.loginService.getUserId(), [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      ministryId:[''],
      ministryName:['']
    });

  filteredMinistries: Observable<Ministry[]>;

  constructor(public dialogRef: MatDialogRef<EventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private eventService: EventService,
              private loginService: LoginService,
              private ministryService: MinistryService) { }
  
  ngOnInit() {
    if(this.data.event != null) {
      //TODO: Find a better way to map this. I cry as I type it...
      this.eventForm.get('id').setValue(this.data.event.id);
      this.eventForm.get('description').setValue(this.data.event.title);
      this.eventForm.get('startDate').setValue(this.data.event.start);
      this.eventForm.get('startTime').setValue(this.pullTime(this.data.event.start));
      this.eventForm.get('endDate').setValue(this.data.event.end);
      this.eventForm.get('endTime').setValue(this.pullTime(this.data.event.end));
      this.eventForm.get('schedulerId').setValue(this.data.event.schedulerId);
      this.eventForm.get('ministryId').setValue(this.data.event.ministryId);
    }

    this.filteredMinistries = this.eventForm.get('ministryName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.ministryService.getMinistries(0, 10, value)
          .pipe(
              map(resp => resp.results)
            ))
      );
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    const eventFormData = this.eventForm.value;
    const event: Event = {
      id: eventFormData.id,
      description: eventFormData.description,
      startTime: this.mergeDatetime(eventFormData.startDate, eventFormData.startTime),
      endTime: this.mergeDatetime(eventFormData.endDate, eventFormData.endTime),
      schedulerId: eventFormData.schedulerId,
      ministryId: eventFormData.ministryId
    };

    if(this.eventForm.get("id").value > 0) {
      this.eventService.updateEvent(event).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.eventService.createEvent(event).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  private mergeDatetime(date: Date, time: string): Date {
    const timeBits = time.split(":");
    date = setHours(date, +timeBits[0]);
    date = setMinutes(date, +timeBits[1]);
    date = setSeconds(date, timeBits.length > 2? +timeBits[2]: 0);
    return date;
  }

  private pullTime(date: Date): string {
    alert("Pulling time from " + date);
    return date.getHours() + ":" + this.pad(date.getMinutes(), 2);
  }

  private pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  selectMinistry(event: any): void {
    var selected = event.option.value;
    this.eventForm.get('ministryName').setValue(selected.name);
    this.eventForm.get('ministryId').setValue(selected.id);
  }

  selectMinistryName(ministry?: Ministry): string | undefined {
    return ministry ? typeof ministry === 'string' ? ministry : ministry.name : undefined;
  }

  cancel() {
    this.dialogRef.close();
  }
}
