import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, WeekDay } from '@angular/common';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { startOfHour, endOfYear, addHours, addSeconds } from 'date-fns';

import { LoginService } from 'sc-common';
import { SCValidation } from 'sc-common';

import { doLater, deepEqual } from '../../sccommon/utils';

import { CategoryService } from '../../sccommon/services/category.service';
import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';
import { DepartmentService } from '../../sccommon/services/department.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';
import { AdminOverrideDialogComponent } from '../../sccommon/admin-override-dialog/admin-override-dialog.component';

import { MinistryService } from '../../ministry/services/ministry.service';

import { PersonService } from 'sc-common';

import { PersonDialogComponent } from '../../person/person-dialog/person-dialog.component';

import { Event, Recurrence, SelectedEvent, EventConflict } from '../../sccommon/event';
import { Reservation } from '../../sccommon/reservation';
import { EventService } from '../../sccommon/services/event.service';
import { RecurringEditDialogComponent } from '../recurring-edit-dialog/recurring-edit-dialog.component';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventFormComponent),
      multi: true
    }
  ]
})
export class EventFormComponent implements OnInit {

 eventForm = this.fb.group({
      id: [0],
      title: ["", Validators.required],
      description: [''],
      privateEvent: false,
      startTime: [startOfHour(addHours(new Date(), 1)), Validators.required],
      endTime: [startOfHour(addHours(new Date(), 2)), Validators.required],
      schedulerId:['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      contactId:['', [Validators.pattern(SCValidation.NUMBER)]],
      ministryId:[''],
      attendees: '',
      departments: [],
      departmentIds: [],
      categories: [],
      categoryIds: [],
      recurringMeeting: [false],
      recurrence: null,
      reservations: []
    });

  static SHARED_FIELDS = ['title', 'description', 'privateEvent', 
                         'schedulerId', 'contactId', 'ministryId', 
                         'departments', 'categories'];

  event: Event = new Event();
  customEvents : Event[];

  formSubs: Subscription[] = [];

  meetingLength: number = 3600;

  futureDates: number = 0;
  conflictCount: number = 0;
  futureConflicts: number = 0;

  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private eventService: EventService,
              public ministryService: MinistryService,
              public personService: PersonService,
              public loginService: LoginService,
              private cleaningService: DataCleanupService,
              public departmentService: DepartmentService,
              public categoryService: CategoryService) { }

  ngOnInit() {
    this.enableSubscriptions();
    this.event = this.getEventFromForm();
  }

  private notifyObservers(newEvent: Event) {
    if(deepEqual(this.event, newEvent))
      return;

    this.event = newEvent;
    this.onChange(this.event);
    this.onTouched();
  }

  userCan(action: string): boolean {
    return this.loginService.getUserId() === this.eventForm.get('schedulerId').value? 
        this.loginService.userCan(action): 
        this.loginService.userCan("admin." + action);
  }

  openPersonDialog(field: string): void {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.eventForm.get(field).setValue(result.id);
    });
  }

  canSave() {
    return (this.conflictCount == 0 && this.futureConflicts == 0) || 
           (this.getValue("id") == 0 && this.loginService.userCan("admin.event.create")) ||
           (this.getValue("id") > 0 && this.loginService.userCan("admin.event.edit"));
  }

  isCustomRecurrence() {
    if(!this.getValue('recurringMeeting'))
      return false;
    const recur = this.eventForm.get('recurrence').value;
    return recur && recur.cycle === 'CUSTOM';
  }

  updateConflictCount(count: number) {
    this.conflictCount = count;
  }

  updateFutureConflictCount(count: number) {
    this.futureConflicts = count;
  }

  updateFutureDates(futureDates: Date[]) {
    this.futureDates = futureDates.length;
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private populateEvent(eventData: Event): void {
    this.event = eventData;
    const recur = eventData.recurrence;
    if(recur != undefined && recur != null) {
      this.eventForm.get('recurringMeeting').setValue(true);

      //HACK. Interceptor can't seem to figure out the difference between an array of 1 string and a raw string
      if (recur.exceptionDates && !Array.isArray(recur.exceptionDates)) {
        var exceptionDates = [];
        exceptionDates.push(recur.exceptionDates);
        recur.exceptionDates = exceptionDates;
      } 

      if(recur.cycle == 'CUSTOM') {
        this.eventService.getFutureEvents(eventData.id).subscribe(events => this.customEvents=events);
      }
    }

    this.meetingLength = (eventData.endTime.getTime() - eventData.startTime.getTime())/1000;
    this.eventForm.patchValue(eventData, {'emitEvent': false});
  }

 
  private recurringMeetingDefaults() {
    this.eventForm.get('recurrence').enable();
    if(!this.getValue('recurrence')) {
      this.eventForm.get('recurrence').setValue({
        "cycle":'WEEKLY', 
        "frequency":1, 
        "endDate":endOfYear(new Date()), 
        "weeklyDays":[WeekDay[this.eventForm.get('startTime').value.getDay()].toUpperCase()]
      });
    }
  }

  private enableSubscriptions() {
    this.formSubs.push(
      this.eventForm.get('startTime').valueChanges      
        .pipe(distinctUntilChanged())
        .subscribe( start => {
          if(!start) return;

          const end = addSeconds(start, this.meetingLength);
          if(!end) return;

          this.eventForm.get('endTime').setValue(end);
        }));

    this.formSubs.push(
      this.eventForm.get('endTime').valueChanges      
        .pipe(distinctUntilChanged())
        .subscribe( end => {
          if(!end || end == this.getValue('endTime')) return;

          var start = this.getValue('startTime');
          if(!start) return;

          this.meetingLength = (end.getTime() - start.getTime())/1000;
        }));

    this.formSubs.push(
      this.eventForm.get('recurringMeeting').valueChanges
        .pipe(debounceTime(0), distinctUntilChanged())
        .subscribe( value => {
          if(value)
            this.recurringMeetingDefaults();
        }));

    this.formSubs.push(
      this.eventForm.get('ministryId').valueChanges.pipe(debounceTime(0), distinctUntilChanged())
        .subscribe(id => {
          if(!id)
            return;
          
          const contact = this.eventForm.get('contactId');
          if(!contact.value) {
            this.ministryService.getPrimaryContact(id).subscribe(contactId => contact.setValue(contactId));
          }
        }));

    EventFormComponent.SHARED_FIELDS.forEach(f => {
      this.formSubs.push(
        this.eventForm.get(f).valueChanges.pipe(debounceTime(300))
          .subscribe(value => this.updateCustomEvents(f, value)));
    });

    this.eventForm.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
      .subscribe(event => this.notifyObservers(this.cleaningService.prune<Event>(event, new Event().asTemplate())));
  }

  private updateCustomEvents(field: string, value:any) {
    if(this.isCustomRecurrence() && this.customEvents)
      this.customEvents.forEach(e => e[field] = value);
  }

  private getEventFromForm(): Event {
    return this.cleaningService.prune<Event>(this.eventForm.value, new Event().asTemplate());
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if(!value)
      return;
    
    this.populateEvent(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
  }
}
