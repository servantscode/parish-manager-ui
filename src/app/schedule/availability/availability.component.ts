import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../../sccommon/reservation';
import { AvailabilityResponse, AvailabilityWindow } from '../availability-response';
import { startOfDay, endOfDay, differenceInMinutes, addDays, addMinutes, addHours, isBefore, min, max } from 'date-fns';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit, OnChanges {
  @Input() displayHeader = false;
  @Input() reservation: Reservation;
  @Input() displayTime: Date;
  _reservation: Reservation;
  
  reservations: Reservation[];

  @Input() isAvailable: boolean = false;
  @Output() isAvailableChange = new EventEmitter<boolean>();

  availability: any[];
  visibleEvents: any[];

  dayStartHour = 6;
  dayEndHour = 22;
  visibleDay: Date;
  openMinutes = (this.dayEndHour-this.dayStartHour)*60;

  constructor(private reservationService: ReservationService,
              private router: Router) { }

  ngOnInit() {}

  ngOnChanges() {
    if(!this.reservation)
      return;

    //Set it the first time
    if(!this.visibleDay)
      this.visibleDay = this.displayTime? this.displayTime: this.reservation.startTime;

    if(this.reservations &&
       this._reservation.id == this.reservation.id &&
       this._reservation.resourceType == this.reservation.resourceType &&
       this._reservation.resourceId == this.reservation.resourceId &&
       startOfDay(this._reservation.startTime) == startOfDay(this.reservation.startTime)) {
      this.processReservations();
    } else {
      this.getReservations();
    }
    this._reservation = this.reservation;
  }

  gotoEvent(id: number) {
    this.router.navigate(['calendar', 'event', id]);
  }

  getReservations() {
    const start = min(this.reservation.startTime, startOfDay(this.visibleDay));
    const end = max(this.reservation.endTime, endOfDay(this.visibleDay));
    this.reservationService.getReservations(this.reservation, start, end).subscribe(
      resp => {
        this.reservations = resp.filter(res => res.eventId !== this.reservation.eventId);
        this.processReservations();
      });
  }

  formatTime(hour: number) {
    return (hour > 12? hour - 12: hour) + " " + (hour > 11? "P": "A");
  }

  navDays(days: number) {
    this.visibleDay = addDays(this.visibleDay, days);
    this.getReservations();
  }

  resetVisibleDay() {
    this.visibleDay = this.displayTime? this.displayTime: this.reservation.startTime;
    this.getReservations();
  }

  private processReservations() {
    this.isAvailable = this.reservations.filter(res => this.overlaps(res, this.reservation)).length == 0;
    this.isAvailableChange.emit(this.isAvailable);

    this.availability = this.reservations.concat([this.reservation]);
    this.availability.sort((a,b) => differenceInMinutes(a.startTime, b.startTime));
    this.markOverlaps();
    this.markPlacement();
  }

  private calculateWidth(window: any) {
    if(isBefore(window.endTime, this.visibleStart()) || 
       isBefore(this.visibleEnd(), window.startTime)) {
      return 0;
    }
    return this.diffMin(window.startTime, window.endTime)*100/this.openMinutes;
  }

  private calculateStart(window: any) {
    return differenceInMinutes(window.startTime, this.visibleStart())*100/this.openMinutes;    
  }

  private visibleStart(): Date {
    return addHours(startOfDay(this.visibleDay), this.dayStartHour);
  }

  private visibleEnd(): Date {
    return addHours(startOfDay(this.visibleDay), this.dayEndHour);
  }

  private markOverlaps() {
    var overlapset = [];
    for(let win of this.availability) {
      win.overlaps=0;
      overlapset = overlapset.filter(other => this.overlaps(win, other));
      overlapset.push(win);
      if( overlapset.length > 1 )
        overlapset.forEach(window => window.overlaps = overlapset.length);
    }
  }

  private markPlacement() {
    var overlapset = [];
    for(let win of this.availability) {
      overlapset = overlapset.filter(other => this.overlaps(win, other));
      win.left = this.calculateStart(win);
      win.width = this.calculateWidth(win);
      if(win.overlaps) {
        win.height = 100/(win.overlaps);
        win.top = win.height*overlapset.length;
        overlapset.push(win);
      } else {
        win.height = 100;
        win.top = 0;
      }
    }
    this.visibleEvents = this.availability.filter(w => w.width > 0);
  }

  private overlaps(win1: any, win2: any): boolean {
    return !(win1.startTime <= win2.startTime && win1.endTime <= win2.startTime) &&
           !(win1.startTime >= win2.endTime && win1.endTime >= win2.endTime);
  }

  private diffMin(d1: Date, d2: Date) {
    return Math.abs(differenceInMinutes(d1, d2));
  }
}
