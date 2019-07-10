import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, WeekDay } from '@angular/common';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { startOfHour, endOfYear, addHours, addSeconds } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';
import { SCValidation } from '../../sccommon/validation';

import { doLater } from '../../sccommon/utils';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';
import { AdminOverrideDialogComponent } from '../../sccommon/admin-override-dialog/admin-override-dialog.component';

import { MinistryService } from '../../ministry/services/ministry.service';

import { PersonService } from '../../sccommon/services/person.service';

import { Event, Recurrence, SelectedEvent, EventConflict } from '../event';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';
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

  static SHARED_FIELDS = ['title', 'description', 'privateEvent', 
                         'schedulerId', 'contactId', 'ministryId', 
                         'departments', 'categories'];


  event: Event;
  customEvents : Event[];

  disabled: boolean = false;
  editMode: boolean = false;
  formSubs: Subscription[] = [];

  meetingLength: number = 3600;

  futureDates: number = 0;
  conflictCount: number = 0;
  futureConflicts: number = 0;

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
              private selectedEvent: SelectedEvent) { }

  ngOnInit() {
    this.route.params.subscribe(
        params => {
          this.getEvent();

          //Is this a new event or has an edit been requested at the handoff?
          if(!this.event.id) {
            this.edit(true);
          } else if (this.selectedEvent.edit) {
            this.selectedEvent.edit = false;
            this.edit(true);
          } else {
            this.edit(false);
          }
        }
    );

    // this.enableSubscriptions(); //Try to figure out if it's possible to do this
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
      this.event = this.cleaningService.prune<Event>(this.selectedEvent.event, new Event().asTemplate());
      this.populateEvent(this.event);

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
      const dialogRef = this.dialog.open(RecurringEditDialogComponent, {
        width: '400px',
        data: {"title": "Edit Recurring Event",
               "text": `This is a recurring meeting with ${this.futureDates? this.futureDates: ""} future events. Do you wish to edit the future events?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result) {
          this.eventForm.get('recurringMeeting').setValue(false);
          this.eventForm.get('recurrence').setValue(null);
        }
        
        this.edit(true);
      });
    } else {
      this.edit(true);
    }
  }

  copyEvent(): void {
    if(!this.loginService.userCan("event.create"))
      return;

    const event = this.getEventFromForm();
    event.id = 0;
    event.title = 'Copy of ' + event.title;
    if(event.recurrence)
      event.recurrence.id = 0;
    event.reservations = event.reservations.map(res => {
        res.id = 0; 
        res.eventId = 0;
        return this.cleaningService.prune(res, new Reservation().asTemplate());
      });

    this.populateEvent(event);

    this.location.replaceState("/calendar/event");
    this.edit(true);
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    if(this.conflictCount == 0 && this.futureConflicts == 0) {
      this.storeEvent();
    } else if(this.canSave()) {
      var dialogText = "";
      if(!this.event.recurrence && this.conflictCount > 0)
        dialogText += `This meeting request has ${this.conflictCount} resource conflict${this.conflictCount == 1? "": "s"}.<br/>`;
      if(this.event.recurrence && this.futureConflicts > 0)
        dialogText += `This meeting request has ${this.futureConflicts} conflict${this.futureConflicts == 1? "": "s"}.<br/>`;

      dialogText += "Are you sure you wish to proceed?";

      this.dialog.open(AdminOverrideDialogComponent, {
        width: '400px',
        data: {"title": "Reservation Conflicts",
               "text" : dialogText,
               "confirm": () => { 
                 this.storeEvent(); 
               }
          }
      });
    }
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


  delete(): void {
    if(this.getValue('recurringMeeting')) {
      const dialogRef = this.dialog.open(RecurringEditDialogComponent, {
        width: '400px',
        data: {"title": "Delete Recurring Event",
               "text": `This is a recurring meeting with ${this.futureDates} future events. Do you wish to delete the future events?`
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

  cancel() {
    if(this.editMode && this.getValue("id")) {
      this.edit(false);
      this.getEvent();
    } else {
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  private storeEvent() {
    const recurrence = this.getValue('recurrence');

    if(this.getValue("id") > 0) {
      if(!this.loginService.userCan("event.update"))
        this.goBack();

      if(this.isCustomRecurrence()) {
        const cleanEvents = this.customEvents.map(e => {
          const ev = this.cleaningService.prune(e, new Event().asTemplate());
          if(ev.reservations)
            ev.reservations = ev.reservations.map(res => this.cleaningService.prune(res, new Reservation().asTemplate()));
          return ev;
        });
        this.eventService.updateSeries(cleanEvents).
          subscribe(() => this.goBack());
      } else {
        this.eventService.update(this.getEventFromForm()).
          subscribe(() => this.goBack());
      }
    } else {
      if(!this.loginService.userCan("event.create"))
        this.goBack();

      if(this.isCustomRecurrence()) {
        const cleanEvents = this.customEvents.map(e => {
          const ev = this.cleaningService.prune(e, new Event().asTemplate());
          if(ev.reservations)
            ev.reservations = ev.reservations.map(res => this.cleaningService.prune(res, new Reservation().asTemplate()));
          return ev;
        });
        this.eventService.createSeries(cleanEvents).
          subscribe(() => this.cancel());
      } else {
        this.eventService.create(this.getEventFromForm()).
          subscribe(() => this.cancel());
      }
    }
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private populateEvent(eventData: Event): void {
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
    this.eventForm.patchValue(eventData);
    this.event = this.getEventFromForm();
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

  private edit(enableEdit: boolean) {
    this.editMode = enableEdit;
    this.disabled = !enableEdit;
    if(enableEdit) {
      for(let control in this.eventForm.controls)
        this.eventForm.get(control).enable();

      this.enableSubscriptions();
    } else {
      this.disableSubscriptions();

      for(let control in this.eventForm.controls)
        this.eventForm.get(control).disable();
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
      this.eventForm.get('recurrence').valueChanges.pipe(debounceTime(0), distinctUntilChanged())
        .subscribe(recur => { 
            doLater(function () {
              this.event = this.getEventFromForm();
            }.bind(this))
          }));

    this.formSubs.push(
      this.eventForm.get('reservations').valueChanges.pipe(debounceTime(0), distinctUntilChanged())
        .subscribe(() => this.event = this.getEventFromForm()));

    EventDetailsComponent.SHARED_FIELDS.forEach(f => {
      this.formSubs.push(
        this.eventForm.get(f).valueChanges.pipe(debounceTime(300))
          .subscribe(value => this.updateCustomEvents(f, value)));
    });
  }

  private updateCustomEvents(field: string, value:any) {
    if(this.isCustomRecurrence() && this.customEvents)
      this.customEvents.forEach(e => e[field] = value);
  }

  private disableSubscriptions() {
    this.formSubs.forEach(sub => sub.unsubscribe());
    this.formSubs = [];
  }

  private getEventFromForm(): Event {
    return this.cleaningService.prune<Event>(this.eventForm.value, new Event().asTemplate());
  }
}