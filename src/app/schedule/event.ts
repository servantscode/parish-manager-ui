import { Injectable } from '@angular/core';
import { Reservation } from './reservation';
import { Identifiable } from '../sccommon/identifiable';

export class Event extends Identifiable {

  constructor() { 
    super(); 
  }

  startTime: Date;
  endTime: Date;
  title: string;
  description: string;
  schedulerId: number;
  ministryName: string;
  ministryId: number;

  reservations: Reservation[] = [];
  recurrence: Recurrence;

  identify(): string {
    return this.title;
  }


  asTemplate(): Event {
    this.id=0;
    this.startTime = null;
    this.endTime = null;
    this.title = '';
    this.description = '';
    this.schedulerId = 0;
    this.ministryName = '';
    this.ministryId = 0;

    this.reservations = [];
    this.recurrence = null;
    return this;
  }
}

export class Recurrence {
  id: number;
  cycle: string;
  frequency: number;
  endDate: Date;
  weeklyDays: string[] = [];
}

@Injectable()
export class SelectedEvent {

    public event: any;

    public constructor() { }
}