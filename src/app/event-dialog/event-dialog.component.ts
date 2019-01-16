import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'
import { startOfHour, addHours, addSeconds, setHours, setMinutes, setSeconds, format } from 'date-fns';

import { Event } from '../event';
import { Ministry } from '../ministry';
import { EventService } from '../services/event.service';
import { MinistryService } from '../services/ministry.service';
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
      startDate:['', Validators.required],
      startTime:['', [Validators.required, Validators.pattern(SCValidation.TIME)]],
      endDate:['', Validators.required],
      endTime:['', [Validators.required, Validators.pattern(SCValidation.TIME)]],
      schedulerId:['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      ministryId:[''],
      ministryName:['']
    });

  filteredMinistries: Observable<Ministry[]>;
  meetingLength: number = 3600;
  focusedDateField: string = null;

  constructor(public dialogRef: MatDialogRef<EventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private eventService: EventService,
              private ministryService: MinistryService) { }

  ngOnInit() {
    if(this.data.event != null) 
      this.populateForm(this.data.event);

    this.filteredMinistries = this.eventForm.get('ministryName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.ministryService.getMinistries(0, 10, value)
          .pipe(
              map(resp => resp.results)
            ))
      );

    this.eventForm.get('startDate').valueChanges
      .subscribe( value => {
          const endDate = this.eventForm.get('endDate');
          if(value > endDate.value) 
            endDate.setValue(value);
        });

    this.eventForm.get('startTime').valueChanges
      .subscribe( value => {
        if( !this.eventForm.get('startDate').valid || !this.eventForm.get('startTime').valid)
          return;

        const start = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));
        const end = addSeconds(start, this.meetingLength);
        this.eventForm.get('endDate').setValue(end);
        this.eventForm.get('endTime').setValue(this.pullTime(end));
      });

    this.eventForm.get('endTime').valueChanges
      .subscribe( () => {
          const start: Date = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));
          const end: Date = this.mergeDatetime(this.getValue('endDate'), this.getValue('endTime'));
          this.meetingLength = (end.getTime() - start.getTime())/1000;
        });
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    if(this.getValue("id") > 0) {
      this.eventService.updateEvent(this.translateForm(this.eventForm.value)).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.eventService.createEvent(this.translateForm(this.eventForm.value)).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
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

  focusField(fieldName: string): void {
    this.focusedDateField = fieldName;
  }

  formatTime(fieldName: string): void {
    const field = this.eventForm.get(fieldName);
    const timeOnly = this.calculateTime(field.value);
    field.setValue(this.pullTime(timeOnly));
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private populateForm(eventData: any): void {
    this.meetingLength = (eventData.end - eventData.start)/1000;
    this.eventForm.get('id').setValue(eventData.id);
    this.eventForm.get('description').setValue(eventData.title);
    this.eventForm.get('startDate').setValue(eventData.start);
    this.eventForm.get('startTime').setValue(this.pullTime(eventData.start));
    this.eventForm.get('endDate').setValue(eventData.end);
    this.eventForm.get('endTime').setValue(this.pullTime(eventData.end));
    this.eventForm.get('schedulerId').setValue(eventData.schedulerId);
    this.eventForm.get('ministryName').setValue(eventData.ministryName);
    this.eventForm.get('ministryId').setValue(eventData.ministryId);
  }

  private translateForm(formData: any): Event {
    const event: Event = new Event();
    event.id = formData.id;
    event.description = formData.description;
    event.startTime = this.mergeDatetime(formData.startDate, formData.startTime);
    event.endTime = this.mergeDatetime(formData.endDate, formData.endTime);
    event.schedulerId = formData.schedulerId;
    event.ministryName = formData.ministryName;
    event.ministryId = formData.ministryId;
    return event;
  }

  private mergeDatetime(date: Date, time: string): Date {
    const timeOnly = this.calculateTime(time);
    date = setHours(date, timeOnly.getHours());
    date = setMinutes(date, timeOnly.getMinutes());
    date = setSeconds(date, timeOnly.getSeconds());
    return date;
  }

  private calculateTime(time: string): Date {
    const parser = /^(\d+)(:(\d+))?(:(\d+))?\s*(\w+)?$/;
    var match = parser.exec(time);
    if(match == null)
      return;

    var hours = match[1]? +match[1]: 0;
    const minutes = match[3]? +match[3]: 0;
    const seconds = match[5]? +match[5]: 0;
    var dayHalf = match[6]? match[6]: "";

    if(dayHalf.toUpperCase().startsWith("A"))
      dayHalf = "AM"
    else if(dayHalf.toUpperCase().startsWith("P"))
      dayHalf = "PM"
    else
      dayHalf = hours > 8 && hours !== 12? "AM": "PM"

    if(dayHalf === "AM" && hours >= 12)
      hours -= 12;
    if(dayHalf === "PM" && hours < 12)
      hours += 12;

    return new Date(0, 0, 0, hours, minutes, seconds);
  }

  private pullTime(date: Date): string {
    return format(date, date.getSeconds() > 0? 'h:mm:ss A': 'h:mm A');
  }

  private pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
