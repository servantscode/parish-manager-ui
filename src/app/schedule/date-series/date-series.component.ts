import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startOfDay, isEqual, compareAsc, isAfter } from 'date-fns';

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

  exceptionDates: Date[] = [];

  futureEvents: any[] = [];
  open: boolean[] = [];

  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private eventService: EventService,
              private reservationService: ReservationService) { }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {

    const recur = this.event.recurrence;

    if(recur)
      this.calculateFutureTimes();
  }

  toggleConflict(i: number) {
    this.open[i] = !this.open[i];
  }

  addException(i: number) {
    const event = this.futureEvents[i];
    event.excluded=true;
    this.exceptionDates.push(startOfDay(event.startTime));
    this.notifyObservers();
  }

  undoException(i: number) {
    const event = this.futureEvents[i];
    event.excluded=false;
    const exceptId = this.exceptionDates.findIndex(ed => isEqual(ed, startOfDay(event.startTime)));
    this.exceptionDates.splice(exceptId, 1);
    this.notifyObservers();
  }

  private notifyObservers() {
    this.onChange(this.exceptionDates);
    this.onTouched();
    this.updateFutureConflicts();
  }

  private calculateFutureTimes() {
    const recur = this.event.recurrence;
    if(!recur || (recur.cycle ==='WEEKLY' && recur.weeklyDays.length == 0)) {
      this.futureEvents = [];
    } else {
      this.eventService.calculateFutureTimes(this.event).subscribe(times => {
          this.futureEvents = times.map(t => {
            return {"startTime": t, "excluded": false};
          });
          this.futureEvents = this.futureEvents.concat(
            this.exceptionDates
              .filter(d => isAfter(d, this.event.startTime))
              .map(t => { return {"startTime": t, "excluded": true} }));
          this.futureEvents.sort((a, b) => compareAsc(a.startTime, b.startTime));
          this.open = [].fill(false, 0, this.futureEvents.length);
        });
      this.checkFutureConflicts();
    }
  }

  private checkFutureConflicts() {
    if(this.event.recurrence && this.event.reservations && this.event.reservations.length > 0) {
      this.reservationService.getConflicts(this.event).subscribe(conflicts =>  {
          this.futureEvents.forEach(fe => delete fe.conflicts);
          conflicts.forEach(c => {
              const fe = this.futureEvents.find(e => isEqual(e.startTime, c.event.startTime));
              if(fe)
                fe.conflicts = c;
            });
          this.updateFutureConflicts();
        });
    }
  }

  private updateFutureConflicts() {
    var conflictCount = this.futureEvents.filter(e => e.conflicts && !e.excluded).length;
    this.futureConflictsChange.emit(conflictCount);
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
    
    this.exceptionDates = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
  }
}
