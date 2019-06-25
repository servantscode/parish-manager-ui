import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { startOfDay, addDays, isEqual, compareAsc, isAfter } from 'date-fns';
import { debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';
import { deepEqual } from '../../sccommon/utils';

import { EventService } from '../services/event.service';
import { ReservationService } from '../services/reservation.service';

import { CustomEventDialogComponent } from '../custom-event-dialog/custom-event-dialog.component';
import { Event, EventConflict } from '../event';
import { Reservation } from '../reservation';

@Component({
  selector: 'app-custom-date-series',
  templateUrl: './custom-date-series.component.html',
  styleUrls: ['./custom-date-series.component.scss']
})
export class CustomDateSeriesComponent implements OnInit, OnChanges {

  @Input() events: any[];
  @Output() eventsChange = new EventEmitter<any[]>();

  @Output() futureConflictsChange = new EventEmitter<number>();

  lastChange: any[] = [];

  open: boolean[] = [];

  @Input() disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private eventService: EventService,
              private dialog: MatDialog,
              private reservationService: ReservationService,
              private cleaningService: DataCleanupService) { }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
    if(deepEqual(this.lastChange, this.events))
      return;

    this.lastChange = this.events;
    this.checkFutureConflicts();
  }

  toggleConflict(i: number) {
    this.open[i] = !this.open[i];
  }

  addEvent(i: number) {
    var newEvent =Object.assign({}, this.events[this.events.length-1]);

    newEvent.id = 0
    newEvent.startTime = addDays(newEvent.startTime, 1);
    newEvent.endTime = addDays(newEvent.endTime, 1);
    newEvent.reservations = newEvent.reservations.map(r => {
      const res = Object.assign({}, r);
      res.id=0;
      res.startTime = addDays(res.startTime, 1);
      res.endTime = addDays(res.endTime, 1);
      return res;
    });

    const dialogRef = this.dialog.open(CustomEventDialogComponent, {
      width: '800px',
      data: {"event":newEvent}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

    this.events.push(result);
    this.notifyObservers();
    this.checkFutureConflicts();
    });
  }

  editEvent(i: number) {
    const dialogRef = this.dialog.open(CustomEventDialogComponent, {
      width: '800px',
      data: {"event":this.events[i]}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.events[i]=result;
      this.notifyObservers(); 
      this.checkFutureConflicts();
    });
  }

  deleteEvent(i: number) {
    this.events.splice(i, 1);
    this.notifyObservers();
  }

  private notifyObservers() {
    this.onChange(this.events);
    this.onTouched();
    this.updateFutureConflicts();
    this.eventsChange.emit(this.events);
  }

  private checkFutureConflicts() {
    if(this.events && this.events.length > 0) {
      this.reservationService.getCustomEventConflicts(this.events.map(e => {
          const ev = this.cleaningService.prune(e, new Event().asTemplate());
          ev.reservations = ev.reservations.map(res => this.cleaningService.prune(res, new Reservation().asTemplate()));
          return ev;
        })).subscribe(conflicts =>  {
          this.events.forEach(fe => delete fe.conflicts);
          conflicts.forEach(c => {
              const fe = this.events.find(e => isEqual(e.startTime, c.event.startTime));
              if(fe)
                fe.conflicts = c;
            });
          this.updateFutureConflicts();
        });
    }
  }

  private updateFutureConflicts() {
    var conflictCount = this.events.filter(e => e.conflicts).length;
    this.futureConflictsChange.emit(conflictCount);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
  }
}
