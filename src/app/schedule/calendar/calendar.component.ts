import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, startOfHour, addHours, differenceInMilliseconds, addMilliseconds } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import { LoginService } from '../../sccommon/services/login.service';
import { ColorService } from '../../sccommon/services/color.service';

import { Event } from '../event';
import { EventService } from '../services/event.service';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView; //Export CalendarView for html
  events: CalendarEvent[] = [];
  openDialogRef = null;

  search: string = "";

  _displayCount = 5;
  displayAll = true;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  constructor(private router: Router,
              private dialog: MatDialog,
              private eventService: EventService,
              public loginService: LoginService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.newEvent();
    }
  }

  ngOnInit() {
    this.loadEvents();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.loadEvents();
  }

  loadEvents(): void {
    if(!this.loginService.userCan('event.list'))
        this.router.navigate(['not-found']);

    const dateRange = this.calculateRange(this.viewDate, this.view);
    const isDraggable = this.loginService.userCan('event.update');

    this.eventService.getPage(0, 32768, this.eventService.timeRangeQuery(this.search, dateRange.start, dateRange.end)).
      subscribe(eventResponse => {
        this.events = eventResponse.results.map(serverEvent => {
            return {
              start: serverEvent.startTime,
              end: serverEvent.endTime,
              title: serverEvent.description,
              color: this.hasConflict(serverEvent, eventResponse.results)?
                        ColorService.CALENDAR_COLORS.red:
                        ColorService.CALENDAR_COLORS.blue,
              actions: this.actions,
              allDay: false,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: isDraggable,
              schedulerId: serverEvent.schedulerId,
              ministryName: serverEvent.ministryName,
              ministryId: serverEvent.ministryId,
              id: serverEvent.id,
              reservations: serverEvent.reservations,
              recurrence: serverEvent.recurrence
            };
          });
      });
  }

  hasConflict(event: Event, allEvents: Event[]) {
    var conflicts = allEvents.filter(e => e !== event && this.overlaps(e, event) && this.sharedResources(e, event));
    return conflicts.length > 0;
  }

  private overlaps(win1: any, win2: any): boolean {
    return !(win1.startTime <= win2.startTime && win1.endTime <= win2.startTime) &&
           !(win1.startTime >= win2.endTime && win1.endTime >= win2.endTime);
  }

  private sharedResources(e1: Event, e2: Event): boolean {
    if(!e1.reservations)
      return false;

    const sharedResources = e1.reservations.filter(r => {
        if(!e2.reservations)
          return false;
        return e2.reservations.filter(r2 => r.resourceId === r2.resourceId && r.resourceType == r2.resourceType).length > 0;
      });
    return sharedResources.length > 0;
  }

  newEvent() {
    this.router.navigate(['calendar', 'event']);
  }

  editEvent(event: any) {
    this.router.navigate(['calendar', 'event', event.id]);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.editEvent(event);
  }

  displayCount(): number {
    return this.displayAll? 1000: this._displayCount;
  }

  updateSearch(search:string) {
    this.search = search;
    this.loadEvents();
  }

  showAll(): void {
    console.log("showing all");
    this.displayAll = true;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      this.view = CalendarView.Day;
    }
  }

  hourClicked(date: Date) {
    this.editEvent({
        id: 0,
        start: date,
        end: addHours(date, 1),
        title: '',
        schedulerId: this.loginService.getUserId()
      });
  }

  eventTimesChanged({event, newStart, newEnd }: any): void {
    var startDiff = differenceInMilliseconds(newStart, event.start);
    var endDiff = differenceInMilliseconds(newEnd, event.end);

    event.reservations.forEach(res => {
        res.startTime = addMilliseconds(res.startTime, startDiff);
        res.endTime = addMilliseconds(res.endTime, endDiff);
      });

    event.start = newStart;
    event.end = newEnd;
    this.editEvent(event); 
  }

  highlightEvent(event) {
    event.color = event.color === ColorService.CALENDAR_COLORS.blue?
      ColorService.CALENDAR_COLORS.darkBlue:
      ColorService.CALENDAR_COLORS.darkRed;
  }

  unhighlightEvent(event) {
    event.color = event.color === ColorService.CALENDAR_COLORS.darkBlue?
      ColorService.CALENDAR_COLORS.blue:
      ColorService.CALENDAR_COLORS.red;
  }

  private calculateRange(date: Date, view: CalendarView) {
    switch (view) {
      case CalendarView.Month:
        return {start:startOfMonth(date), end:endOfMonth(date)};
      case CalendarView.Week:
        return {start:startOfWeek(date), end:endOfWeek(date)};
      default:
        return {start:startOfDay(date), end:endOfDay(date)};
    }
  }
}