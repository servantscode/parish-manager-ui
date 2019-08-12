import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, startOfYear, endOfYear, addHours, differenceInMilliseconds, addMilliseconds, parse, format, isEqual } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEventTitleFormatter } from 'angular-calendar';

import { LoginService } from '../../sccommon/services/login.service';
import { ColorService } from '../../sccommon/services/color.service';
import { DownloadService } from '../../sccommon/services/download.service';

import { Event, SelectedEvent } from '../event';
import { Reservation } from '../reservation';
import { EventService } from '../services/event.service';

import { TooltipFormatter } from './tooltip-formatter.provider';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: TooltipFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView; //Export CalendarView for html
  events: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  openDialogRef = null;

  listView: boolean = false;

  search: string = "";
  roomFilter: string = null;

  _displayCount = 5;
  displayAll = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private dialog: MatDialog,
              private eventService: EventService,
              public loginService: LoginService,
              private downloadService: DownloadService,
              private selectedEvent: SelectedEvent) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.newEvent();
    }
  }

  ngOnInit() {
    const view = this.route.snapshot.paramMap.get('view');
    if(view) {
      const viewName = view.charAt(0).toUpperCase() + view.slice(1).toLowerCase();
      this.view = CalendarView[viewName];
    }

    const date = this.route.snapshot.paramMap.get('date');
    if(date)
      this.viewDate = parse(date);

    this.loadEvents();
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
    this.loadEvents();
  }

  loadEvents(): void {
    if(!this.loginService.userCan('event.list'))
        this.router.navigate(['not-found']);

    const isDraggable = this.loginService.userCan('event.update');

    this.eventService.getPage(0, 32768, this.query()).
      subscribe(eventResponse => {
        this.events = eventResponse.results.map(serverEvent => {
            return {
              start: serverEvent.startTime,
              end: serverEvent.endTime,
              title: serverEvent.title,
              description: serverEvent.description,
              color: this.hasConflict(serverEvent, eventResponse.results)?
                        ColorService.CALENDAR_COLORS.red:
                        ColorService.CALENDAR_COLORS.blue,
              allDay: false,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: isDraggable,
              privateEvent: serverEvent.privateEvent,
              schedulerId: serverEvent.schedulerId,
              contactId: serverEvent.contactId,
              ministryName: serverEvent.ministryName,
              ministryId: serverEvent.ministryId,
              attendees: serverEvent.attendees,
              departmentIds: serverEvent.departmentIds,
              categoryIds: serverEvent.categoryIds,
              id: serverEvent.id,
              reservations: serverEvent.reservations,
              recurrence: serverEvent.recurrence
            };
          });
        this.filterEvents();
      });
  }

  collectRoomNames(): string[] {
    var roomNames = [];
    this.events.forEach(e => {
          const event: any = e;
          if(event.reservations)
            event.reservations.forEach(r => {
                if(r.resourceType == "ROOM" && !roomNames.includes(r.resourceName))
                  roomNames.push(r.resourceName);
              });
        });
    roomNames.sort();  
    return roomNames;
  }

  selectRoomFilter(roomName: string) {
    if(roomName == this.roomFilter)
      return;

    this.roomFilter = roomName;
    this.filterEvents();
  }

  private filterEvents() {
    if(!this.roomFilter || !this.events) {
      this.filteredEvents = this.events
      return;
    }

    this.filteredEvents = this.events.filter(e => {
        const event: any = e;
        return event.reservations.some(r => r.resourceType == "ROOM" && r.resourceName == this.roomFilter);
      });
  }

  getResourceName(res: Reservation): string {
    return res.resourceName;
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
    if (isSameMonth(date, this.viewDate))
      this.gotoView(CalendarView.Day, date);
  }

  gotoView(view: CalendarView, date: Date) {
    this.viewDate = date;
    this.view = view;
    this.location.replaceState(`/calendar/${view.toLowerCase()}/${format(date, "YYYY-MM-DD")}`);
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

  query(): string {
    const dateRange = this.calculateRange(this.viewDate, this.view);
    return this.eventService.timeRangeQuery(this.search, dateRange.start, dateRange.end)
  }

  downloadReport() {
    const filename = "event-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    this.downloadService.downloadReport(this.eventService.getReport(this.query()), filename);
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