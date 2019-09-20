import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { addMinutes, differenceInMinutes } from 'date-fns';

import { SCValidation } from '../../sccommon/validation';
import { deepEqual, doLater } from '../../sccommon/utils';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { EquipmentService } from '../services/equipment.service';
import { RoomService } from '../services/room.service';
import { RoomAvailabilityDialogComponent } from '../room-availability-dialog/room-availability-dialog.component';

import { Equipment } from '../equipment';
import { Reservation } from '../reservation';
import { Room } from '../room';

export enum TimeScale { 
  MINUTES = 1, 
  HOURS = 60, 
  DAYS = 1440 
};

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReservationComponent),
      multi: true
    }
  ]
})
export class ReservationComponent implements OnInit {

  public timeScales = TimeScale;
  keys = Object.keys(TimeScale).filter(Number).map(Number);

  @Input() startTime: Date;
  @Input() endTime: Date;
  @Input() capacity: number;
  @Input() eventId: number;
  @Input() eventTitle: string;
  @Input() schedulerId: number;
  @Output() availabilityConflictsChange = new EventEmitter<number>();

  disabled: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      room:[''],
      equipment:[''],
      setupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      cleanupTime:['', [Validators.pattern(SCValidation.NUMBER), Validators.min(0)]],
      timeScale: [TimeScale.HOURS]
    });

  value: Reservation[];

  //Imported
  rooms = [];
  roomAvailability = [];
  equipment = [];
  equipmentAvailability = [];


  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              public roomService: RoomService,
              public equipmentService: EquipmentService,
              public cleaningService: DataCleanupService) {}

  ngOnInit() {
    this.form.get('timeScale').valueChanges 
      .pipe(distinctUntilChanged())
      .subscribe( () => {
          this.updateReservationTimes();
        });

    this.form.get('setupTime').valueChanges
      .pipe(debounceTime(0), distinctUntilChanged())
      .subscribe( newTime => {
          this.updateReservationTimes();
        });

    this.form.get('cleanupTime').valueChanges
      .pipe(debounceTime(0), distinctUntilChanged())
      .subscribe( newTime => {
          this.updateReservationTimes();
        });

    this.form.get('room').valueChanges
      .subscribe( value => {
          this.addRoom(value);
          this.notifyObservers();
        });

    this.form.get('equipment').valueChanges
      .subscribe( value => {
          this.addEquipment(value);
          this.notifyObservers();
        });
  }

  ngOnChanges(changes: SimpleChanges) {
     this.rooms.forEach(room => room.eventTitle = this.eventTitle);
     this.equipment.forEach(equip => equip.eventTitle = this.eventTitle);
     this.updateReservationTimes();
  }

  setValues(value: Reservation[]): void {
    if(value.length > 0) {
      //Need this to be a cycle behind to allow start and end times to be set properly
      doLater(function() {
        var setupTime = differenceInMinutes(this.startTime, value[0].startTime);
        var cleanupTime = differenceInMinutes(value[0].endTime, this.endTime);

        if(setupTime%TimeScale.DAYS == 0 && cleanupTime%TimeScale.DAYS == 0) {
          this.form.get('timeScale').setValue(TimeScale.DAYS);
          setupTime /= TimeScale.DAYS;
          cleanupTime /= TimeScale.DAYS;
        } else if(setupTime%TimeScale.HOURS == 0 && cleanupTime%TimeScale.HOURS == 0) {
          this.form.get('timeScale').setValue(TimeScale.HOURS);
          setupTime /= TimeScale.HOURS;
          cleanupTime /= TimeScale.HOURS;
        } else {
          this.form.get('timeScale').setValue(TimeScale.MINUTES);
        }

        this.form.get('setupTime').setValue(setupTime);
        this.form.get('cleanupTime').setValue(cleanupTime);
      }.bind(this));
    }

    this.rooms = value.filter((r) => r.resourceType == 'ROOM');
    this.roomAvailability = [].fill(false, 0, this.rooms.length);
    this.equipment = value.filter((r) => r.resourceType == 'EQUIPMENT');
    this.equipmentAvailability = [].fill(false, 0, this.equipment.length);
  }

  collectReservations(): Reservation[] {
    var reservations = [];
    this.rooms.forEach(r => reservations.push(this.cleaningService.prune(r, new Reservation().asTemplate())));
    this.equipment.forEach(r => reservations.push(this.cleaningService.prune(r, new Reservation().asTemplate())));
    return reservations;
  }

  notifyObservers() {
    var val: Reservation[] = this.collectReservations();

    if(deepEqual(val, this.value))
      return;
        
    this.value = val;
    this.onChange(this.value);
    this.onTouched();
  }

  private countConflicts(): number {
    return this.roomAvailability.filter(avail => !avail).length + this.equipmentAvailability.filter(avail => !avail).length;
  }

  findAvailableRooms(): void {
    const dialogRef = this.dialog.open(RoomAvailabilityDialogComponent, {
      width: '400px',
      data: { "startTime": this.startTime,
              "endTime": this.endTime, 
              "capacity": this.capacity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.addRoom(result);
    });
  }

  roomFilter() {
    return function(rooms: Room[]) {
      return rooms.filter(room => !this.rooms.find(res => res.resourceId == room.id));
    }.bind(this);
  }

  addRoom(room: Room): void {
    if(!room) return;

    var newRoom = {
      resourceName: room.name,
      type: room.type,
      capacity: room.capacity,
      resourceType: 'ROOM',
      resourceId: room.id,
      eventId: this.eventId,
      eventTitle: this.eventTitle,
      reservingPersonId: this.schedulerId
    };

    this.rooms.push(newRoom);

    this.roomAvailability.push(false);
    doLater(function() {this.form.get('room').reset()}.bind(this));
    this.updateReservationTimes();
  }

  setRoomAvailability(index: number, available: boolean) {
    this.roomAvailability[index]=available;
    this.availabilityConflictsChange.emit(this.countConflicts());
  }

  removeRoom(index: number): void {
    this.rooms.splice(index, 1);
    this.roomAvailability.splice(index, 1);
    this.availabilityConflictsChange.emit(this.countConflicts());
    this.notifyObservers();
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
      eventId: this.eventId,
      eventTitle: this.eventTitle,
      reservingPersonId: this.schedulerId
    });
    this.equipmentAvailability.push(false);
    this.form.get('equipment').reset();
    this.updateReservationTimes();
  }

  setEquipmentAvailability(index: number, available: boolean) {
    this.equipmentAvailability[index]=available;
    this.availabilityConflictsChange.emit(this.countConflicts());
  }

  removeEquipment(index: number): void {
    this.equipment.splice(index, 1);
    this.equipmentAvailability.splice(index, 1);
    this.availabilityConflictsChange.emit(this.countConflicts());
    this.notifyObservers();
  }

  private updateReservationTimes() {
    const timeScale = this.form.get('timeScale').value;
    var start = this.startTime;
    var end = this.endTime;
    start = addMinutes(start, -this.form.get('setupTime').value * timeScale);
    end = addMinutes(end, this.form.get('cleanupTime').value * timeScale);

    this.rooms = this.rooms.map(room => this.cloneToNewTime(room, start, end));
    this.equipment = this.equipment.map(equip => this.cloneToNewTime(equip, start, end));
    this.notifyObservers();
  }

  private cloneToNewTime(res: any, start:Date, end:Date) {
    var clone = Object.assign({}, res);
    clone.startTime = start;
    clone.endTime = end;
    return clone;
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Reservation[]) {
    if(!value)
      return;
    
    this.value = value;
    this.setValues(this.value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
