import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { RoomAvailabilityDialogComponent } from '../room-availability-dialog/room-availability-dialog.component';

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
      room:[''],
      equipment:[''],
      setupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      cleanupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      recurringMeeting: [false],
      recurrence: this.fb.group({
        recurrenceId: [''],
        recurrenceType: ['DAILY'],
        recurrenceFreq: [1, [Validators.pattern(SCValidation.NUMBER), Validators.min(1)]],
        recurUntil: [endOfYear(new Date())],
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
        sunday: [false]
      })
    });

  event: Event;
  recurringMeeting = false;
  futureTimes: Date[]  = [];
  exceptionDates: Date[] = [];
  cycleOptions: any[] = [];

  disabled: boolean = false;
  editMode: boolean = false;
  formSubs: Subscription[] = [];
  conflicts: EventConflict[] = [];

  rooms = [];
  roomAvailability = [];
  equipment = [];
  equipmentAvailability = [];

  meetingLength: number = 3600;
  showConflicts = false;
  showDateList = false;

  private daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private eventService: EventService,
              public ministryService: MinistryService,
              public personService: PersonService,
              public roomService: RoomService,
              public equipmentService: EquipmentService,
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

    this.updateRecurrenceOptions();  
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

  findAvailableRooms(): void {
    const dialogRef = this.dialog.open(RoomAvailabilityDialogComponent, {
      width: '400px',
      data: {"event": this.getEventFromForm()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.addRoom(result);
    });
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
        if(!result) {
          this.eventForm.get('recurrence').reset();
          this.eventForm.get('recurringMeeting').setValue(false);
          this.clearRecurringMeeting();
        }
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

  toggleDateList() {
    this.showDateList = !this.showDateList;
  }

  addException(conflict: EventConflict) {
    this.exceptionDates.push(conflict.event.startTime);
    this.conflicts = this.conflicts.filter(con => con !== conflict);
    this.futureTimes = this.futureTimes.filter(time => !isEqual(time, conflict.event.startTime));
  }

  calculateFutureTimes() {
    if(this.recurringMeeting) {
      const e = this.getEventFromForm();
      if(e.recurrence.cycle ==='WEEKLY' && e.recurrence.weeklyDays.length == 0) {
        this.futureTimes = [];
      } else {
        this.eventService.calculateFutureTimes(e).subscribe(times => this.futureTimes=times);
        this.updateReservationTimes();
      }
    }
  }

  recurringWeekly(): boolean {
    return this.getRecurValue('recurrenceType') === 'WEEKLY';
  }

  copyEvent(): void {
    if(!this.loginService.userCan("event.create"))
      return;

    this.eventForm.get('id').setValue(null);
    this.event.id = 0;
    this.eventForm.get('recurrence').get('recurrenceId').setValue(null);
    if(this.event.reservations)
      this.event.reservations.forEach(res => res.id = 0);
    if(this.rooms)
      this.rooms.forEach(res => res.id = 0);
    if(this.equipment)
      this.equipment.forEach(res => res.id = 0);

    this.location.replaceState("/calendar/event");
    this.editMode = true;
    this.enableAll();

    this.eventForm.get('title').setValue('Copy of ' + this.getValue('title'));
    this.updateReservationTimes();
  }

  updateRecurrenceOptions() {
    const freq = this.getRecurValue('recurrenceFreq');
    const start = this.getValue('startTime');

    this.cycleOptions.length = 0;
    this.cycleOptions.push({value: "DAILY", text: (freq === 1? "day": "days")});
    this.cycleOptions.push({value: "WEEKLY", text: (freq === 1? "week": "weeks")});
    const monthly = ((freq === 1? "month": "months") + ` on the ${this.positionize(start.getDate())}`);
    this.cycleOptions.push({value: "DAY_OF_MONTH", text: monthly});
    const day = this.toDayName(start.getDay());
    const monthlyDayOfWeek = ((freq === 1? "month": "months") + 
      ` on the ${this.positionize(Math.floor((start.getDate()-1)/7) + 1)} ${day}`);
    this.cycleOptions.push({value: "WEEKDAY_OF_MONTH", text: monthlyDayOfWeek});
    this.cycleOptions.push({value: "YEARLY", text: (freq === 1? "year": "years")});

    var isPristine = true;
    for(let weekday of this.daysOfTheWeek)
      isPristine = isPristine && this.eventForm.get('recurrence').get(weekday.toLowerCase()).pristine;

    if(isPristine) {
      for(let weekday of this.daysOfTheWeek)
        this.eventForm.get('recurrence').get(weekday.toLowerCase()).setValue(false);
      this.eventForm.get('recurrence').get(day.toLowerCase()).setValue(true);
    }
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    var conflicts = this.countConflicts();

    if(conflicts == 0) {
      this.storeEvent();
    } else if(this.loginService.userCan("admin.event.override")) {
      this.dialog.open(AdminOverrideDialogComponent, {
        width: '400px',
        data: {"title": "Reservation Conflicts",
               "text" : (conflicts > 0? `This meeting request has ${conflicts} resource conflict${conflicts == 1? "": "s"}.<br/>`: "")+
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
    return (this.countConflicts() == 0 && this.conflicts.length == 0) || this.loginService.userCan("admin.event.override");
  }

  private countConflicts() {
    return this.roomAvailability.filter(avail => !avail).length + this.equipmentAvailability.filter(avail => !avail).length;
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

  roomFilter() {
    return function(rooms: Room[]) {
      return rooms.filter(room => !this.rooms.find(res => res.resourceId == room.id));
    }.bind(this);
  }

  addRoom(room: Room): void {
    if(!room) return;

    this.rooms.push({
      resourceName: room.name,
      type: room.type,
      capacity: room.capacity,
      resourceType: 'ROOM',
      resourceId: room.id,
      eventId: this.getValue('id'),
      eventTitle: this.getValue('title'),
      reservingPersonId: this.eventForm.get('schedulerId').value
    });
    this.roomAvailability.push(false);
    this.eventForm.get('room').reset();
    this.updateReservationTimes();
  }

  setRoomAvailability(index: number, available: boolean) {
    this.roomAvailability[index]=available;
  }

  removeRoom(index: number): void {
    this.rooms.splice(index, 1);
    this.roomAvailability.splice(index, 1);
    this.checkFutureConflicts();
  }

  equipmentFilter() {
    return function(equipment: Equipment[]) {
        return equipment.filter(equip => !this.equipment.find(res => res.resourceId == equip.id));
    }.bind(this);
  }

  addEquipment(equip: Equipment): void {
    if(!equip) return;

    this.equipment.push({
      resourceName: equip.name,
      description: equip.description,
      manufacturer: equip.manufacturer,
      resourceType: 'EQUIPMENT',
      resourceId: equip.id,
      eventId: this.getValue('id'),
      eventTitle: this.getValue('title'),
      reservingPersonId: this.getValue('schedulerId')
    });
    this.equipmentAvailability.push(false);
    this.eventForm.get('equipment').reset();
    this.updateReservationTimes();
  }

  setEquipmentAvailability(index: number, available: boolean) {
    this.equipmentAvailability[index]=available;
  }

  removeEquipment(index: number): void {
    this.equipment.splice(index, 1);
    this.equipmentAvailability.splice(index, 1);
    this.checkFutureConflicts();
  }

  private checkFutureConflicts() {
    if(!this.recurringMeeting)
      return;

    this.reservationService.getConflicts(this.getEventFromForm()).subscribe(conflicts =>  {
        this.conflicts = conflicts
        if(this.conflicts && this.conflicts.length > 0 && isEqual(this.conflicts[0].event.startTime, this.getValue('startTime')))
          this.conflicts.shift();
      });
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

  private updateReservationTimes() {
    var start = this.getValue('startTime');
    var end = this.getValue('endTime');
    start = addMinutes(start, -this.getValue('setupTime'));
    end = addMinutes(end, this.getValue('cleanupTime'));

    this.rooms = this.rooms.map(room => this.cloneToNewTime(room, start, end));
    this.equipment = this.equipment.map(equip => this.cloneToNewTime(equip, start, end));
    this.checkFutureConflicts();
  }

  private cloneToNewTime(res: any, start:Date, end:Date) {
    var clone = Object.assign({}, res);
    clone.startTime = start;
    clone.endTime = end;
    return clone;
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private getRecurValue(fieldName: string): any {
    return this.eventForm.get('recurrence').get(fieldName).value;
  }

  private populateEvent(eventData: Event): void {
    if(!eventData.recurrence)
      delete eventData.recurrence;

    this.meetingLength = (eventData.endTime.getTime() - eventData.startTime.getTime())/1000;
    this.eventForm.patchValue(eventData);

    if(eventData.reservations) {
      if(eventData.reservations.length > 0) {
        const setupTime = differenceInMinutes(eventData.startTime, eventData.reservations[0].startTime);
        const cleanupTime = differenceInMinutes(eventData.reservations[0].endTime, eventData.endTime);
        this.eventForm.get('setupTime').setValue(setupTime);
        this.eventForm.get('cleanupTime').setValue(cleanupTime);
      }

      this.rooms = eventData.reservations.filter((r) => r.resourceType == 'ROOM');
      this.roomAvailability = [].fill(false, 0, this.rooms.length);
      this.equipment = eventData.reservations.filter((r) => r.resourceType == 'EQUIPMENT');
      this.equipmentAvailability = [].fill(false, 0, this.equipment.length);
    }

    if(eventData.recurrence != undefined && eventData.recurrence != null) {
      const recurrence = this.eventForm.get('recurrence');
      this.eventForm.get('recurringMeeting').setValue(true);
      this.recurringMeeting=true;

      const recur = eventData.recurrence;
      recurrence.get('recurrenceId').setValue(recur.id);
      recurrence.get('recurrenceType').setValue(recur.cycle);
      recurrence.get('recurrenceFreq').setValue(recur.frequency);
      recurrence.get('recurUntil').setValue(recur.endDate);
      if(recur.weeklyDays.length > 0) {
        for(let day of recur.weeklyDays) {
          var control = recurrence.get(day.toLowerCase());
          control.setValue(true);
          control.markAsDirty();
        }
      }

      //HACK. Interceptor can't seem to figure out the difference between an array of 1 string and a raw string
      if(!Array.isArray(recur.exceptionDates)) {
        this.exceptionDates = [];
        this.exceptionDates.push(recur.exceptionDates);
      } else {
        this.exceptionDates = recur.exceptionDates;
      }

      this.eventService.getFutureTimes(eventData.id).subscribe(resp => this.futureTimes = resp);
      this.updateReservationTimes();
    } else {
      this.clearRecurringMeeting();
    }
  }

  private clearRecurringMeeting() {
    this.recurringMeeting=false;
    this.eventForm.get('recurringMeeting').setValue(false);
    this.futureTimes = [];
    this.exceptionDates = [];
    this.conflicts = [];
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
          this.updateReservationTimes();
          this.updateRecurrenceOptions()
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
      this.eventForm.get('room').valueChanges
        .subscribe( value => this.addRoom(value)));

    this.formSubs.push(
      this.eventForm.get('equipment').valueChanges
        .subscribe( value => this.addEquipment(value)));

    this.formSubs.push(
      this.eventForm.get('recurringMeeting').valueChanges.pipe(debounceTime(0))
        .pipe(distinctUntilChanged())
        .subscribe( value => {

          this.recurringMeeting = value;
          if(this.recurringMeeting)
            this.calculateFutureTimes();
          else
            this.clearRecurringMeeting();
        }));

    this.formSubs.push(
      this.eventForm.get('recurrence').get('recurrenceFreq').valueChanges
        .subscribe( () => this.updateRecurrenceOptions()));

    this.formSubs.push(
      this.eventForm.get('setupTime').valueChanges
        .pipe(distinctUntilChanged())
        .subscribe( newTime => this.updateReservationTimes()));

    this.formSubs.push(
      this.eventForm.get('cleanupTime').valueChanges
        .pipe(distinctUntilChanged())
        .subscribe( newTime => this.updateReservationTimes() ));

    this.formSubs.push(
      this.eventForm.get('title').valueChanges
        .subscribe( desc => {
           this.rooms.forEach(room => room.eventTitle = desc);
           this.equipment.forEach(equip => equip.eventTitle = desc);
        }));

    this.formSubs.push(
      this.eventForm.get('recurrence').valueChanges.pipe(debounceTime(0))
        .subscribe(() => this.calculateFutureTimes()));
  }

  private disableSubscriptions() {
    this.formSubs.forEach(sub => sub.unsubscribe());
    this.formSubs = [];
  }


  private getEventFromForm(): Event {
    const formData = this.eventForm.value;

    const event: Event = this.cleaningService.prune<Event>(formData, new Event().asTemplate());

    if(!event.reservations)
      event.reservations = [];

    for(let room of this.rooms)
      event.reservations.push(this.cleaningService.prune(room, Reservation.template()));

    for(let equip of this.equipment)
      event.reservations.push(this.cleaningService.prune(equip, Reservation.template()));

    if(formData.recurringMeeting) {
      const recurrence = formData.recurrence;
      const r = new Recurrence();
      r.id = recurrence.recurrenceId;
      r.cycle = recurrence.recurrenceType;
      r.frequency = recurrence.recurrenceFreq;
      r.endDate = recurrence.recurUntil;
      r.weeklyDays = [];
      if(recurrence.monday) r.weeklyDays.push('MONDAY');
      if(recurrence.tuesday) r.weeklyDays.push('TUESDAY');
      if(recurrence.wednesday) r.weeklyDays.push('WEDNESDAY');
      if(recurrence.thursday) r.weeklyDays.push('THURSDAY');
      if(recurrence.friday) r.weeklyDays.push('FRIDAY');
      if(recurrence.saturday) r.weeklyDays.push('SATURDAY');
      if(recurrence.sunday) r.weeklyDays.push('SUNDAY');
      r.exceptionDates = this.exceptionDates;
      event.recurrence = r;
    } else {
      //Clear recurrence if it doesn't belong
      event.recurrence = null;
    }

    return event;
  }

  private positionize(input: number): string {
    var lastPosition = input % 10;
    switch (lastPosition) {
      case 1:
        return input == 11? "llth": input + "st";
      case 2:
        return input + "nd";
      case 3:
        return input + "rd";
      default:
        return input + 'th';
    }
  }

  private toDayName(input: number): string {
    return this.daysOfTheWeek[input];
  }
}