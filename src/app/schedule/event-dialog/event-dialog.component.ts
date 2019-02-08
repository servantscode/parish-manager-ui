import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { startOfHour, endOfYear, addHours, addMinutes, addSeconds, setHours, setMinutes, setSeconds, format, differenceInMinutes } from 'date-fns';

import { LoginService } from '../../sccommon/services/login.service';
import { SCValidation } from '../../sccommon/validation';

import { DataCleanupService } from '../../services/data-cleanup.service';

import { MinistryService } from '../../ministry/services/ministry.service';
import { Ministry } from '../../ministry/ministry';

import { Event, Recurrence } from '../event';
import { Room } from '../room';
import { Equipment } from '../equipment';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';
import { RoomService } from '../services/room.service';
import { EquipmentService } from '../services/equipment.service';

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
      ministryName:[''], 
      room:[''],
      equipment:[''],
      setupTime:[0, [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      cleanupTime:[0, [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
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

  filteredMinistries: Observable<Ministry[]>;

  addingRoom = false;
  filteredRooms: Observable<Room[]>;
  rooms = [];
  
  filteredEquipment: Observable<Equipment[]>;
  equipment = [];

  recurringMeeting = false;
  recurringWeekly = false;

  meetingLength: number = 3600;
  focusedDateField: string = null;

  cycleOptions: any[] = [];

  private daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(public dialogRef: MatDialogRef<EventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private eventService: EventService,
              private ministryService: MinistryService,
              private roomService: RoomService,
              private equipmentService: EquipmentService,
              private loginService: LoginService,
              private cleaningService: DataCleanupService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if(this.data.event != null) {
      this.populateForm(this.data.event);
      if(!this.loginService.userCan('event.update'))
        this.disableAll();
    }

    this.filteredMinistries = this.eventForm.get('ministryName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.ministryService.getPage(0, 10, value)
          .pipe(
              map(resp => resp.results)
            ))
      );

    this.filteredRooms = this.eventForm.get('room').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.roomService.getPage(0, 10, value)
          .pipe(
              map(resp => resp.results)
            ))
      );

    this.filteredEquipment = this.eventForm.get('equipment').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.equipmentService.getPage(0, 10, value)
          .pipe(
              map(resp => resp.results
                .filter(e => !this.equipment.find(item => item.resourceId === e.id)))
            ))
      );

    this.eventForm.get('startDate').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( value => {
          const endDate = this.eventForm.get('endDate');
          if(value > endDate.value) 
            endDate.setValue(value);

          this.updateRecurrence();
          this.checkAvailability();
        });

    this.eventForm.get('startTime').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( value => {
        if( !this.eventForm.get('startDate').valid || !this.eventForm.get('startTime').valid)
          return;

        const start = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));
        const end = addSeconds(start, this.meetingLength);
        this.eventForm.get('endDate').setValue(end);
        this.eventForm.get('endTime').setValue(this.formatTimeString(end));
        this.checkAvailability();
      }); 

    this.eventForm.get('endDate').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( value => {
          this.checkAvailability();
        });

    this.eventForm.get('endTime').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( () => {
          const start: Date = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));
          const end: Date = this.mergeDatetime(this.getValue('endDate'), this.getValue('endTime'));
          this.meetingLength = (end.getTime() - start.getTime())/1000;
          this.checkAvailability();
       });

    this.eventForm.get('recurringMeeting').valueChanges
      .subscribe( value => { this.recurringMeeting = value; });

    this.eventForm.get('recurrenceType').valueChanges
      .subscribe( value => {this.recurringWeekly = (value === 'WEEKLY')});

    this.eventForm.get('recurrenceFreq').valueChanges
      .subscribe( () => { this.updateRecurrence() });

    this.eventForm.get('setupTime').valueChanges
      .subscribe( () => this.checkAvailability());

    this.eventForm.get('cleanupTime').valueChanges
      .subscribe( () => this.checkAvailability());

    this.updateRecurrence();
  }

  updateRecurrence() {
    const freq = this.getValue('recurrenceFreq');
    const start = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));

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
    var start = this.mergeDatetime(this.getValue('startDate'), this.getValue('startTime'));
    var end = this.mergeDatetime(this.getValue('endDate'), this.getValue('endTime'));
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

  selectRoomName(room?: Room): string | undefined {
    return room ? typeof room === 'string' ? room : room.name : undefined;
  }

  selectEquipmentName(equipment?: Equipment): string | undefined {
    return equipment ? typeof equipment === 'string' ? equipment : equipment.name : undefined;
  }

  addRoom(event: any): void {
    const room = event.option.value;
    this.rooms[0] = {
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      resourceType: 'ROOM',
      resourceId: room.id,
      eventId: this.eventForm.get('id').value,
      reservingPersonId: this.eventForm.get('schedulerId').value,
    };
    this.checkAvailability();
  }

  addEquipment(event: any): void {
    const equip = event.option.value;
    this.equipment.push({
      name: equip.name,
      description: equip.description,
      manufacturer: equip.manufacturer,
      resourceType: 'EQUIPMENT',
      resourceId: equip.id,
      eventId: this.eventForm.get('id').value,
      reservingPersonId: this.eventForm.get('schedulerId').value,
    });
    this.eventForm.get('equipment').setValue('');
    this.checkAvailability();
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
    field.setValue(this.formatTimeString(timeOnly));
  }

  private getValue(fieldName: string): any {
    return this.eventForm.get(fieldName).value;
  }

  private populateForm(eventData: any): void {
    this.meetingLength = (eventData.end - eventData.start)/1000;
    this.eventForm.get('id').setValue(eventData.id);
    this.eventForm.get('description').setValue(eventData.title);
    this.eventForm.get('startDate').setValue(eventData.start);
    this.eventForm.get('startTime').setValue(this.formatTimeString(eventData.start));
    this.eventForm.get('endDate').setValue(eventData.end);
    this.eventForm.get('endTime').setValue(this.formatTimeString(eventData.end));
    this.eventForm.get('schedulerId').setValue(eventData.schedulerId);
    this.eventForm.get('ministryName').setValue(eventData.ministryName);
    this.eventForm.get('ministryId').setValue(eventData.ministryId);

    if(eventData.reservations != undefined && eventData.reservations != null) {
      for(let res of eventData.reservations)
        res.name = res.resourceName;

      this.rooms = eventData.reservations.filter((r) => r.resourceType == 'ROOM');
      this.equipment = eventData.reservations.filter((r) => r.resourceType == 'EQUIPMENT');
      if(this.rooms.length > 0) {
        this.eventForm.get('room').setValue(this.rooms[0]);
      }

      if(eventData.reservations.length > 0) {
        const setupTime = Math.abs(differenceInMinutes(eventData.start, eventData.reservations[0].startTime));
        const cleanupTime = Math.abs(differenceInMinutes(eventData.end, eventData.reservations[0].endTime));
        this.eventForm.get('setupTime').setValue(setupTime);
        this.eventForm.get('cleanupTime').setValue(cleanupTime);
      }
    }

    if(eventData.recurrence != undefined && eventData.recurrence != null) {
      const recur = eventData.recurrence;
      this.eventForm.get('recurringMeeting').setValue(true);
      this.recurringMeeting=true;
      var recurType = recur.cycle;
      this.recurringWeekly = recurType === 'WEEKLY';
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
    const event: Event = new Event();
    event.id = formData.id;
    event.description = formData.description;
    event.startTime = this.mergeDatetime(formData.startDate, formData.startTime);
    event.endTime = this.mergeDatetime(formData.endDate, formData.endTime);
    event.schedulerId = formData.schedulerId;
    event.ministryName = formData.ministryName;
    event.ministryId = formData.ministryId;

    for(let room of this.rooms) {
      const res = this.cleaningService.prune(room, Reservation.template());
      event.reservations.push(res);
    }

    for(let equip of this.equipment) {
      const res = this.cleaningService.prune(equip, Reservation.template());
      event.reservations.push(res);
    }

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

  private formatTimeString(date: Date): string {
    return format(date, date.getSeconds() > 0? 'h:mm:ss A': 'h:mm A');
  }

  private pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
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
