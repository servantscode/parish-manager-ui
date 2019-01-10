import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import { Event } from '../event';
import { EventService } from '../services/event.service';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: { 
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView; //Export CalendarView for html
  events: CalendarEvent[];

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

  constructor(private dialog: MatDialog,
              private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.loadEvents();
  }

  loadEvents(): void {
    const dateRange = this.calculateRange(this.viewDate, this.view);

    this.eventService.getEvents(dateRange.start, dateRange.end).
      subscribe(eventResponse => {
        this.events = eventResponse.map(serverEvent => {
            return {
              start: serverEvent.startTime,
              end: serverEvent.endTime,
              title: serverEvent.description,
              color: colors.red,
              actions: this.actions,
              allDay: false,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true,
              schedulerId: serverEvent.schedulerId,
              ministryId: serverEvent.ministryId,
              id: serverEvent.id
            };
          });
      });
  }

  openEventModal(event: CalendarEvent) {
    event = event == undefined? null: event;
    const eventRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {"date": this.viewDate, "event": event }
    });

    eventRef.afterClosed().subscribe(result => {
      this.loadEvents();
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.openEventModal(event);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  }

  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
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