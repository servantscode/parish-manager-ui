import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { startOfHour, endOfYear, addHours, addMinutes, addSeconds, setHours, setMinutes, setSeconds, format, differenceInMinutes } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';
import { SCValidation } from '../../sccommon/validation';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

import { MinistryService } from '../../ministry/services/ministry.service';
import { Ministry } from '../../ministry/ministry';

import { PersonService } from '../../person/services/person.service';

import { Event, Recurrence } from '../event';
import { Room } from '../room';
import { Equipment } from '../equipment';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';
import { RoomService } from '../services/room.service';
import { EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      startTime: [startOfHour(addHours(new Date(), 1)), Validators.required],
      endTime: [startOfHour(addHours(new Date(), 2)), Validators.required],
      schedulerId:[this.loginService.getUserId(), [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      ministryId:[''],
      room:[''],
      equipment:[''],
      setupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      cleanupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      recurringMeeting: [false],
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
    });

  event: Event;
  recurringMeeting = false;
  cycleOptions: any[] = [];

  rooms = [];
  equipment = [];

  meetingLength: number = 3600;


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
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if(!this.loginService.userCan("event.update"))
      this.disableAll();

    this.getEvent();

    this.route.params.subscribe(
        params => {
            this.getEvent();
        }
    );

    this.eventForm.get('startTime').valueChanges.subscribe( start => {
        if(!start) return;

        const end = addSeconds(start, this.meetingLength);
        if(!end) return;

        this.eventForm.get('endTime').setValue(end);
        this.checkAvailability();
      });

    this.eventForm.get('endTime').valueChanges.subscribe( end => {
        if(!end) return;

        var start = this.eventForm.get('startTime').value;
        if(!start) return;

        this.meetingLength = (end.getTime() - start.getTime())/1000;
        this.checkAvailability();
      });

    this.eventForm.get('room').valueChanges
      .subscribe( value => this.addRoom(value));

    this.eventForm.get('equipment').valueChanges
      .subscribe( value => this.addEquipment(value));

    this.eventForm.get('recurringMeeting').valueChanges
      .subscribe( value => { this.recurringMeeting = value; });

    this.eventForm.get('recurrenceFreq').valueChanges
      .subscribe( () => { this.updateRecurrenceOptions() });

    this.eventForm.get('setupTime').valueChanges
      .subscribe( () => this.checkAvailability());

    this.eventForm.get('cleanupTime').valueChanges
      .subscribe( () => this.checkAvailability());

    this.updateRecurrenceOptions();
  }

  getEvent(): void {
    this.event = new Event();
    const id = +this.route.snapshot.paramMap.get('id');

    if(id > 0) {
      if(!this.loginService.userCan('event.read'))
        this.router.navigate(['not-found']);

      this.eventService.getEvent(id).
        subscribe(event => {
          this.event = event;
          this.populateEvent(event);
        });

    } else {
      if(!this.loginService.userCan('event.create'))
        this.router.navigate(['not-found']);
    }
  }

  recurringWeekly(): boolean {
    return this.getValue('recurrenceType') === 'WEEKLY';
  }

  updateRecurrenceOptions() {
    const freq = this.getValue('recurrenceFreq');
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
      isPristine = isPristine && this.eventForm.get(weekday.toLowerCase()).pristine;

    if(isPristine) {
      for(let weekday of this.daysOfTheWeek)
        this.eventForm.get(weekday.toLowerCase()).setValue(false);
      this.eventForm.get(day.toLowerCase()).setValue(true);
    }
  }

  checkAvailability() {
    var start = this.getValue('startTime');
    var end = this.getValue('endTime');
    start = addMinutes(start, -this.getValue('setupTime'));
    end = addMinutes(end, this.getValue('cleanupTime'));

    var newRooms = [];
    for(let room of this.rooms) {
      var newRoom = Object.assign({}, room);
      newRoom.startTime = start;
      newRoom.endTime = end;
      newRooms.push(newRoom);
    }
    this.rooms = newRooms;

    var newEquipment = [];
    for(let equip of this.equipment) {
      var newEquip = Object.assign({}, equip);
      newEquip.startTime = start;
      newEquip.endTime = end;
      newEquipment.push(newEquip);
    }
    this.equipment = newEquipment;
  }

  createEvent() {
    if(!this.eventForm.valid) {
      this.cancel();
      return;
    }

    if(this.getValue("id") > 0) {
      if(!this.loginService.userCan("event.create"))
        this.goBack();

      this.eventService.updateEvent(this.translateForm(this.eventForm.value)).
        subscribe(() => {
          this.goBack();
        });
    } else {
      if(!this.loginService.userCan("event.update"))
        this.goBack();

      this.eventService.createEvent(this.translateForm(this.eventForm.value)).
        subscribe(() => {
          this.goBack();
        });
    }
  }

  delete(): void {
    var description = this.getValue("description");
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + description + "?",
             "delete": (): Observable<void> => { 
               return this.eventService.deleteEvent(this.getValue("id"), description); 
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
      eventDescription: this.getValue('description'),
      reservingPersonId: this.eventForm.get('schedulerId').value
    });
    this.eventForm.get('room').reset();
    this.checkAvailability();
  }

  removeRoom(index: number): void {
    this.rooms.splice(index, 1);
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
      eventDescription: this.getValue('description'),
      reservingPersonId: this.getValue('schedulerId')
    });
    this.eventForm.get('equipment').reset();
    this.checkAvailability();
  }

  removeEquipment(index: number): void {
    this.equipment.splice(index, 1);
  }

  cancel() {
    this.goBack();
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

    if(eventData.reservations) {
      if(eventData.reservations.length > 0) {
        const setupTime = differenceInMinutes(eventData.startTime, eventData.reservations[0].startTime);
        const cleanupTime = differenceInMinutes(eventData.reservations[0].endTime, eventData.endTime);
        this.eventForm.get('setupTime').setValue(setupTime);
        this.eventForm.get('cleanupTime').setValue(cleanupTime);
      }

      this.rooms = eventData.reservations.filter((r) => r.resourceType == 'ROOM');
      this.equipment = eventData.reservations.filter((r) => r.resourceType == 'EQUIPMENT');
    }

    if(eventData.recurrence != undefined && eventData.recurrence != null) {
      const recur = eventData.recurrence;
      this.eventForm.get('recurrenceId').setValue(recur.id);
      this.eventForm.get('recurringMeeting').setValue(true);
      this.recurringMeeting=true;
      var recurType = recur.cycle;
      this.eventForm.get('recurrenceType').setValue(recurType);
      this.eventForm.get('recurrenceFreq').setValue(recur.frequency);
      this.eventForm.get('recurUntil').setValue(recur.endDate);
      if(recur.weeklyDays.length > 0) {
        for(let day of recur.weeklyDays) {
          var control = this.eventForm.get(day.toLowerCase());
          control.setValue(true);
          control.markAsDirty();
        }
      }
    }
  }

  private disableAll() {
    for(let control in this.eventForm.controls)
      this.eventForm.get(control).disable();
  }

  private translateForm(formData: any): Event {
    const event: Event = this.cleaningService.prune<Event>(formData, new Event().asTemplate());

    if(!event.reservations)
      event.reservations = [];

    for(let room of this.rooms)
      event.reservations.push(this.cleaningService.prune(room, Reservation.template()));

    for(let equip of this.equipment)
      event.reservations.push(this.cleaningService.prune(equip, Reservation.template()));

    if(this.recurringMeeting) {
      const r = new Recurrence();
      r.id = formData.recurrenceId;
      r.cycle = formData.recurrenceType;
      r.frequency = formData.recurrenceFreq;
      r.endDate = formData.recurUntil;
      r.weeklyDays = [];
      if(formData.monday) r.weeklyDays.push('MONDAY');
      if(formData.tuesday) r.weeklyDays.push('TUESDAY');
      if(formData.wednesday) r.weeklyDays.push('WEDNESDAY');
      if(formData.thursday) r.weeklyDays.push('THURSDAY');
      if(formData.friday) r.weeklyDays.push('FRIDAY');
      if(formData.saturday) r.weeklyDays.push('SATURDAY');
      if(formData.sunday) r.weeklyDays.push('SUNDAY');
      event.recurrence = r;
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