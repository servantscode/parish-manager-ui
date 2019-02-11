import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, startOfHour, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import { LoginService } from '../../sccommon/services/login.service';
import { ColorService } from '../../sccommon/services/color.service';

import { Event } from '../event';
import { EventService } from '../services/event.service';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

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

  refresh: Subject<any> = new Subject();

  constructor(private router: Router,
              private dialog: MatDialog,
              private eventService: EventService,
              private loginService: LoginService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.openEventModal(null);
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

    this.eventService.getEvents(dateRange.start, dateRange.end).
      subscribe(eventResponse => {
        this.events = eventResponse.map(serverEvent => {
            return {
              start: serverEvent.startTime,
              end: serverEvent.endTime,
              title: serverEvent.description,
              color: ColorService.CALENDAR_COLORS.blue,
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

  openEventModal(event: any) {

    if(this.openDialogRef != null)
      return;

    if(event == undefined) {
      event = {
        id: 0,
        start: addHours(startOfHour(this.viewDate), 1),
        end: addHours(startOfHour(this.viewDate), 2),
        title: '',
        schedulerId: this.loginService.getUserId()
      };
    } 

    if((event.id != 0 && !this.loginService.userCan('event.read')) ||
       (event.id == 0 && !this.loginService.userCan('event.create')))
        return;

    this.openDialogRef = this.dialog.open(EventDialogComponent, {
      width: '1000px',
      data: {"event": event}
    });

   this.openDialogRef.afterClosed().subscribe(result => {
      this.openDialogRef= null;
      this.loadEvents();
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.openEventModal(event);
  }

  displayCount(): number {
    return this.displayAll? 1000: this._displayCount;
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
    this.openEventModal({
        id: 0,
        start: date,
        end: addHours(date, 1),
        title: '',
        schedulerId: this.loginService.getUserId()
      });
  }

  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.openEventModal(event); 
  }

  highlightEvent(event) {
    event.color = ColorService.CALENDAR_COLORS.darkBlue;
  }

  unhighlightEvent(event) {
    event.color = ColorService.CALENDAR_COLORS.blue;
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