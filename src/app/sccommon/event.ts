import { Injectable } from '@angular/core';
import { Reservation } from './reservation';
import { Identifiable } from 'sc-common';

export class Event extends Identifiable {

  constructor() { 
    super(); 
  }

  startTime: Date;
  endTime: Date;
  title: string;
  privateEvent: boolean;
  description: string;
  schedulerId: number;
  contactId: number;
  ministryName: string;
  ministryId: number;
  attendees: number;
  departments: string[];
  departmentIds: number[];
  categories: string[];
  categoryIds: number[];
  sacramentType: string;

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
    this.privateEvent = false;
    this.schedulerId = 0;
    this.contactId = 0;
    this.ministryName = '';
    this.ministryId = 0;
    this.attendees = 0;
    this.departments = [];
    this.departmentIds = [];
    this.categories = [];
    this.categoryIds=[];
    this.sacramentType = null;

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
  exceptionDates: Date[] = [];
}

@Injectable()
export class SelectedEvent {

    public event: any;
    public edit: boolean;

    public constructor() { }
}

export class EventConflict {
  event: Event;
  conflicts: Reservation[];
}