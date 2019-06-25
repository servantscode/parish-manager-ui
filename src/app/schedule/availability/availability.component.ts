import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../reservation';
import { AvailabilityResponse, AvailabilityWindow } from '../availability-response';
import { startOfDay, endOfDay, differenceInMinutes, addMinutes, addHours } from 'date-fns';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit, OnChanges {
  @Input() displayHeader = false;
  @Input() reservation: Reservation;
  _reservation: Reservation;
  
  reservations: Reservation[];

  @Input() isAvailable: boolean = false;
  @Output() isAvailableChange = new EventEmitter<boolean>();

  availability: any[];

  dayStartHour = 6;
  dayEndHour = 22;
  openMinutes = (this.dayEndHour-this.dayStartHour)*60;

  constructor(private reservationService: ReservationService,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if(!this.reservation)
      return;

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
    this.reservationService.getReservations(this.reservation).subscribe(
      resp => {
        this.reservations = resp.filter(res => res.eventId !== this.reservation.eventId);
        this.processReservations();
      });
  }

  formatTime(hour: number) {
    return (hour > 12? hour - 12: hour) + " " + (hour > 11? "P": "A");
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
    return this.diffMin(window.startTime, window.endTime)*100/this.openMinutes;
  }

  private calculateStart(window: any) {
    return differenceInMinutes(window.startTime, addHours(startOfDay(window.startTime), this.dayStartHour))*100/this.openMinutes;    
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
  }

  private overlaps(win1: any, win2: any): boolean {
    return !(win1.startTime <= win2.startTime && win1.endTime <= win2.startTime) &&
           !(win1.startTime >= win2.endTime && win1.endTime >= win2.endTime);
  }

  private diffMin(d1: Date, d2: Date) {
    return Math.abs(differenceInMinutes(d1, d2));
  }
}
