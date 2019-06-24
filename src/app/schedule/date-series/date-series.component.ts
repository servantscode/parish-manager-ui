import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEqual } from 'date-fns';

import { EventService } from '../services/event.service';
import { ReservationService } from '../services/reservation.service';

import { Event, EventConflict } from '../event';

@Component({
  selector: 'app-date-series',
  templateUrl: './date-series.component.html',
  styleUrls: ['./date-series.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateSeriesComponent),
      multi: true
    }
  ]
})
export class DateSeriesComponent implements OnInit, OnChanges {

  @Input() event: Event;
  @Output() futureConflictsChange = new EventEmitter<number>();

  futureTimes: Date[]  = [];
  exceptionDates: Date[] = [];

  conflicts: EventConflict[] = [];
  showConflicts = false;

  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private eventService: EventService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    if(this.event.id)
      this.eventService.getFutureTimes(this.event.id).subscribe(resp => this.futureTimes = resp);
  }

  ngOnChanges(change: SimpleChanges) {

    const recur = this.event.recurrence;

    if(recur) {
      this.calculateFutureTimes();
  
      //HACK. Interceptor can't seem to figure out the difference between an array of 1 string and a raw string
      if(!recur.exceptionDates) {
        this.exceptionDates = [];
      }else if (!Array.isArray(recur.exceptionDates)) {
        this.exceptionDates = [];
        this.exceptionDates.push(recur.exceptionDates);
      } else {
        this.exceptionDates = recur.exceptionDates;
      }
    } else {
      this.futureTimes = [];
      this.exceptionDates = [];
      this.conflicts = [];
    }

    alert("this.exceptionDates now: " + JSON.stringify(this.exceptionDates));
  }

  toggleConflicts() {
    this.showConflicts = !this.showConflicts;
  }


  addException(conflict: EventConflict) {
    this.exceptionDates.push(conflict.event.startTime);
    this.conflicts = this.conflicts.filter(con => con !== conflict);
    this.futureTimes = this.futureTimes.filter(time => !isEqual(time, conflict.event.startTime));

    this.onChange(this.exceptionDates);
    this.onTouched();
  }

  private calculateFutureTimes() {
    const recur = this.event.recurrence;
    if(!recur || (recur.cycle ==='WEEKLY' && recur.weeklyDays.length == 0)) {
      this.futureTimes = [];
    } else {
      this.eventService.calculateFutureTimes(this.event).subscribe(times => this.futureTimes=times);
      this.checkFutureConflicts();
    }
  }

  private checkFutureConflicts() {
    if(this.event.recurrence && this.event.reservations && this.event.reservations.length > 0) {
      this.reservationService.getConflicts(this.event).subscribe(conflicts =>  {
          this.conflicts = conflicts;
          if(this.conflicts && this.conflicts.length > 0 && isEqual(this.conflicts[0].event.startTime, this.event.startTime))
            this.conflicts.shift();
          this.futureConflictsChange.emit(this.conflicts.length);
        });
    }
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Date[]) {
    if(!value)
      return;
    
    this.exceptionDates = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    // for(let control in this.form.controls) {
    //   var field = this.form.get(control);
    //   isDisabled ? field.disable() : field.enable();
    // }
  }
}
