import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, WeekDay } from '@angular/common';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { startOfHour, endOfYear, addHours, addMinutes, addSeconds, setHours, setMinutes, setSeconds, format, differenceInMinutes, isEqual } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';
import { SCValidation } from '../../sccommon/validation';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';
import { AdminOverrideDialogComponent } from '../../sccommon/admin-override-dialog/admin-override-dialog.component';

import { MinistryService } from '../../ministry/services/ministry.service';
import { Ministry } from '../../ministry/ministry';

import { PersonService } from '../../sccommon/services/person.service';

import { Event, Recurrence, SelectedEvent, EventConflict } from '../event';
import { Room } from '../room';
import { Equipment } from '../equipment';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';
import { RoomService } from '../services/room.service';
import { ReservationService } from '../services/reservation.service';
import { EquipmentService } from '../services/equipment.service';
import { RecurringEditDialogComponent } from '../recurring-edit-dialog/recurring-edit-dialog.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
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
      departments: [],
      categories: [],
      recurringMeeting: [false],
      recurrence: null,
      reservations: []
    });

  event: Event;
  futureTimes: Date[]  = [];
  exceptionDates: Date[] = [];

  disabled: boolean = false;
  editMode: boolean = false;
  formSubs: Subscription[] = [];
  conflicts: EventConflict[] = [];

  meetingLength: number = 3600;
  showConflicts = false;

  conflictCount: number = 0;

  availableDepartments = ["Women", 
                          "Administration", 
                          "Fellowship", 
                          "Family Life", 
                          "Parish Wide", 
                          "Preschool", 
                          "Stewardship", 
                          "Youth", 
                          "Worship", 
                          "Facility Rental", 
                          "Men", 
                          "Outreach", 
                          "Adults", 
                          "Faith Formation", 
                          "Scouts", 
                          "Operations", 
                          "Safe Environment", 
                          "Parish Services"];

  availableCategories = ["Women", 
                         "Social", 
                         "Baptism", 
                         "All Youth", 
                         "Bible Study", 
                         "Worship Services", 
                         "Convalidation", 
                         "Home Centered", 
                         "Wedding Reception", 
                         "Committee", 
                         "Sacramental Preparation",
                         "Athletic Event", 
                         "Funeral",
                         "Middle School", 
                         "Training", 
                         "High School", 
                         "3rd-5th Grade", 
                         "All Parishioners",
                         "Wedding", 
                         "Vacation Bible School", 
                         "Music", 
                         "Retreat", 
                         "Clusters", 
                         "Adult Faith Formation"];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private eventService: EventService,
              public ministryService: MinistryService,
              public personService: PersonService,
              public loginService: LoginService,
              private cleaningService: DataCleanupService,
              private reservationService: ReservationService,
              private changeDetectorRef: ChangeDetectorRef,
              private selectedEvent: SelectedEvent) { 
    
  }

  ngOnInit() {
    this.route.params.subscribe(
        params => {
          this.getEvent();

          //Is this a new event or has an edit been requested at the handoff?
          if(!this.event.id) {
            this.editMode = true;
            this.enableSubscriptions();
          } else if (this.selectedEvent.edit) {
            this.selectedEvent.edit = false;
            this.enableEdit();
          } else {
            this.disableAll();
          }
        }
    );
  }

  userCan(action: string): boolean {
    return this.loginService.getUserId() === this.event.schedulerId || this.loginService.userCan("admin.event." + action);
  }

  getEvent(): void {
    this.event = new Event();
    const id = +this.route.snapshot.paramMap.get('id');
    if(id)
      this.event.id = id;

    if(this.selectedEvent.event) {
      this.event=this.selectedEvent.event;
      this.populateEvent(this.selectedEvent.event);

      this.selectedEvent.event = null;
    } else if(id > 0) {
      if(!this.loginService.userCan('event.read'))
        this.router.navigate(['not-found']);

      this.eventService.get(id).
        subscribe(event => {
          this.event = event;
          this.populateEvent(event);
      });
    } else {
      if(!this.loginService.userCan('event.create'))
        this.router.navigate(['not-found']);
      this.eventForm.get('schedulerId').setValue(this.loginService.getUserId());
    }
  }

  enableEdit(): void {
    if(!this.loginService.userCan("event.update"))
      return;

    if(this.getValue('recurringMeeting')) {
      const count = this.futureTimes.length;
      const dialogRef = this.dialog.open(RecurringEditDialogComponent, {
        width: '400px',
        data: {"title": "Edit Recurring Event",
               "text": `This is a recurring meeting with ${count? count: ""} future events. Do you wish to edit the future events?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result)
          this.clearRecurringMeeting();
        
        this.editMode = true;
        this.enableAll();      
      });
    } else {
      this.editMode = true;
      this.enableAll();
    }
  }

  toggleConflicts() {
    this.showConflicts = !this.showConflicts;
  }

  addException(conflict: EventConflict) {
    this.exceptionDates.push(conflict.event.startTime);
    this.conflicts = this.conflicts.filter(con => con !== conflict);
    this.futureTimes = this.futureTimes.filter(time => !isEqual(time, conflict.event.startTime));
  }

  calculateFutureTimes() {
    if(this.getValue('recurringMeeting')) {
      const e = this.getEventFromForm();
      if(!e.recurrence || (e.recurrence.cycle ==='WEEKLY' && e.recurrence.weeklyDays.length == 0)) {
        this.futureTimes = [];
      } else {
        this.eventService.calculateFutureTimes(e).subscribe(times => this.futureTimes=times);
        this.checkFutureConflicts();
      }
    }
  }

  copyEvent(): void {
    if(!this.loginService.userCan("event.create"))
      return;

    this.eventForm.get('id').setValue(null);
    this.event.id = 0;
    const recurrenceField = this.eventForm.get('recurrence');
    const recurrence = recurrenceField.value;
    recurrence.id = 0;
    recurrenceField.setValue(recurrence);

    this.location.replaceState("/calendar/event");
    this.editMode = true;
    this.enableAll();

    this.eventForm.get('title').setValue('Copy of ' + this.getValue('title'));
    this.checkFutureConflicts();
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    if(this.conflictCount == 0) {
      this.storeEvent();
    } else if(this.loginService.userCan("admin.event.override")) {
      this.dialog.open(AdminOverrideDialogComponent, {
        width: '400px',
        data: {"title": "Reservation Conflicts",
               "text" : (this.conflictCount > 0? `This meeting request has ${this.conflictCount} resource conflict${this.conflictCount == 1? "": "s"}.<br/>`: "")+
               (this.conflicts.length > 0? `This meeting request has ${this.conflicts.length} future conflict${this.conflicts.length == 1? "": "s"}.<br/>`: "") +
               "Are you sure you wish to proceed?",
               "confirm": () => { 
                 return this.storeEvent(); 
               }
          }
      });
    }
  }

  canSave() {
    return (this.conflictCount == 0 && this.conflicts.length == 0) || this.loginService.userCan("admin.event.override");
  }

  updateConflictCount(count: number) {
    alert("Conflict count now: " + count);
    this.conflictCount = count;
  }

  private storeEvent() {
    if(this.getValue("id") > 0) {
      if(!this.loginService.userCan("event.create"))
        this.goBack();

      this.eventService.update(this.getEventFromForm()).
        subscribe(() => {
          this.goBack();
        });
    } else {
      if(!this.loginService.userCan("event.update"))
        this.goBack();

      this.eventService.create(this.getEventFromForm()).
        subscribe(() => {
          this.cancel();
        });
    }
  }

  delete(): void {
    if(this.getValue('recurringMeeting')) {
      const count = this.futureTimes.length;
      const dialogRef = this.dialog.open(RecurringEditDialogComponent, {
        width: '400px',
        data: {"title": "Delete Recurring Event",
               "text": `This is a recurring meeting with ${count} future events. Do you wish to delete the future events?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.confirmDelete(result);
      });
    } else {
      this.confirmDelete(false);
    }
  }

  confirmDelete(deleteFutureEvents: boolean) {
    var title = this.getValue("title");

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + title + "?",
             "delete": (): Observable<void> => { 
               return this.eventService.delete(this.event, deleteFutureEvents); 
             },
             "nav": () => { 
               this.cancel();
             }
        }
    });
  }

  private checkFutureConflicts() {
    if(!this.getValue('recurringMeeting'))
      return;

    const event = this.getEventFromForm();

    if(event.reservations && event.reservations.length > 0) {
      this.reservationService.getConflicts(event).subscribe(conflicts =>  {
          this.conflicts = conflicts
          if(this.conflicts && this.conflicts.length > 0 && isEqual(this.conflicts[0].event.startTime, this.getValue('startTime')))
            this.conflicts.shift();
        });
    }
  }

  cancel() {
    if(this.editMode && this.getValue("id")) {
      this.editMode = false;
      this.disableAll();
      this.getEvent();
    } else {
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private populateEvent(eventData: Event): void {
    this.meetingLength = (eventData.endTime.getTime() - eventData.startTime.getTime())/1000;
    this.eventForm.patchValue(eventData);

    if(eventData.recurrence != undefined && eventData.recurrence != null) {
      this.eventForm.get('recurringMeeting').setValue(true);

      const recur = eventData.recurrence;

      //HACK. Interceptor can't seem to figure out the difference between an array of 1 string and a raw string
      if(!Array.isArray(recur.exceptionDates)) {
        this.exceptionDates = [];
        this.exceptionDates.push(recur.exceptionDates);
      } else {
        this.exceptionDates = recur.exceptionDates;
      }

      this.eventService.getFutureTimes(eventData.id).subscribe(resp => this.futureTimes = resp);
      this.checkFutureConflicts();
    } else {
      this.clearRecurringMeeting();
    }
  }

  private clearRecurringMeeting() {
    this.eventForm.get('recurringMeeting').setValue(false);
    this.eventForm.get('recurrence').disable();

    this.futureTimes = [];
    this.exceptionDates = [];
    this.conflicts = [];
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

  private enableAll() {
    this.disabled = false;
    for(let control in this.eventForm.controls)
      this.eventForm.get(control).enable();

    this.enableSubscriptions();
  }

  private disableAll() {
    this.disabled = true;
    this.disableSubscriptions();

    for(let control in this.eventForm.controls)
      this.eventForm.get(control).disable();
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
          if(value) {
            this.recurringMeetingDefaults();
            this.calculateFutureTimes();
          } else {
            this.clearRecurringMeeting();
          }
        }));

    this.formSubs.push(
      this.eventForm.get('recurrence').valueChanges.pipe(debounceTime(0))
        .subscribe(() => this.calculateFutureTimes()));

    this.formSubs.push(
      this.eventForm.get('reservations').valueChanges.pipe(debounceTime(10))
        .subscribe(value => this.checkFutureConflicts()));

  }

  private disableSubscriptions() {
    this.formSubs.forEach(sub => sub.unsubscribe());
    this.formSubs = [];
  }


  private getEventFromForm(): Event {
    const formData = this.eventForm.value;

    if(formData.recurrence)
      formData.recurrence.exceptionDates = this.exceptionDates;

    return this.cleaningService.prune<Event>(formData, new Event().asTemplate());
  }
}