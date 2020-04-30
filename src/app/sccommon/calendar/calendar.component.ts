import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, TemplateRef, HostListener, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { Subject } from 'rxjs';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isSameMonth, startOfYear, endOfYear, startOfHour, addHours, differenceInMilliseconds, addMilliseconds, parse, format, isEqual } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEventTitleFormatter } from 'angular-calendar';

import { LoginService } from 'sc-common';
import { ColorService } from '../../sccommon/services/color.service';
import { DownloadService } from 'sc-common';
import { CategoryService } from '../../sccommon/services/category.service';
import { DepartmentService } from '../../sccommon/services/department.service';
import { PersonService } from 'sc-common';

import { Event, SelectedEvent } from '../event';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';

import { TooltipFormatter } from './tooltip-formatter.provider';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187
}

@Component({
  selector: 'sc-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: TooltipFormatter
    }
  ]
})
export class CalendarComponent implements OnInit, OnChanges {
  CalendarView = CalendarView; //Export CalendarView for html

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  isDraggable = this.loginService.userCan('event.update');

  @Input() events = [];
  filteredEvents = [];

  listView: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private eventService: EventService,
              public loginService: LoginService,
              private selectedEvent: SelectedEvent) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.newEvent();
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredEvents = this.events.map(event => this.mapEvent(event));
  }

  setView(view: CalendarView): void {
    this.gotoView(view, this.viewDate);
    this.loadEvents();
  }

  toggleListView():void {
    this.listView = !this.listView;
  }

  navigateAndLoad(): void {
    this.gotoView(this.view, this.viewDate);
    // this.loadEvents();
  }

  loadEvents(): void {
    if(!this.loginService.userCan('event.list'))
        this.router.navigate(['not-found']);

    this.eventService.getPage(0, 32768).
      subscribe(eventResponse => {
        this.events = eventResponse.results;
        this.filteredEvents = eventResponse.results.map(serverEvent => this.mapEvent);
      });
  }

  mapEvent(serverEvent: Event) {
    const mapped: any = serverEvent;
    mapped.start = mapped.startTime;
    mapped.end = mapped.endTime;
    mapped.color = ColorService.CALENDAR_COLORS.blue;
    mapped.allDay = false;
    mapped.resizable = {
        beforeStart: true,
        afterEnd: true
      };
    mapped.draggable = this.isDraggable;
    return mapped;
  }

  getResourceName(res: Reservation): string {
    return res.resourceName;
  }

  newEvent() {
    var date = isToday(this.viewDate) ? 
        startOfHour(addHours(new Date(), 1)): 
        addHours(startOfDay(this.viewDate), 8);

    this.editEvent({
        id: 0,
        startTime: date,
        endTime: addHours(date, 1),
        title: '',
        schedulerId: this.loginService.getUserId()
      });
  }

  groupByDate(events: any[]): any {
    var eventGroups: any[] = [];
    var day = null;
    var dayEvents: any[];

    for(let event of events) {
      if(!day || !isEqual(startOfDay(event.start), day)) {
        day = startOfDay(event.start);
        dayEvents = [];
        eventGroups.push({day: day, events: dayEvents});
      }
      dayEvents.push(event);
    }

    return eventGroups;
  }

  viewEvent(event: any) {
    event.startTime = event.start;
    event.endTime = event.end;
    this.selectedEvent.event = event;
    this.selectedEvent.edit = false;
    this.router.navigate(['calendar', 'event', event.id]);
  }

  editEvent(event: any) {
    this.selectedEvent.event = event;
    this.selectedEvent.edit = true;
    this.router.navigate(['calendar', 'event', event.id]);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate))
      this.gotoView(CalendarView.Day, date);
  }

  gotoView(view: CalendarView, date: Date) {
    this.viewDate = date;
    this.view = view;
    // this.location.replaceState(`/calendar/${view.toLowerCase()}/${format(date, "YYYY-MM-DD")}`);
  }

  hourClicked(date: Date) {
    this.editEvent({
        id: 0,
        startTime: date,
        endTime: addHours(date, 1),
        title: '',
        schedulerId: this.loginService.getUserId()
      });
  }

  //NOTE: This gets called when clicking an event even if the times have not changed. Check and suppress.
  eventTimesChanged({event, newStart, newEnd }: any): void {
    var startDiff = differenceInMilliseconds(newStart, event.start);
    var endDiff = differenceInMilliseconds(newEnd, event.end);

    if(startDiff == 0 && endDiff == 0)
      return;

    if(event.reservations) {
      event.reservations.forEach(res => {
          res.startTime = addMilliseconds(res.startTime, startDiff);
          res.endTime = addMilliseconds(res.endTime, endDiff);
        });
    }

    event.startTime = newStart;
    event.endTime = newEnd;
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