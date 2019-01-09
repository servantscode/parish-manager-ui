import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import { Event } from '../event';
import { EventService } from '../services/event.service';

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

  constructor(private modal: NgbModal,
              private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.loadEvents();
  }

  loadEvents(): void {
    var start: Date;
    var end: Date;
    switch (this.view) {
      case CalendarView.Month:
        var start = startOfMonth(this.viewDate);
        var end = endOfMonth(this.viewDate);
        break;
      case CalendarView.Week:
        var start = startOfWeek(this.viewDate);
        var end = endOfWeek(this.viewDate);
        break;
      default:
        var start = startOfDay(this.viewDate);
        var end = endOfDay(this.viewDate);
        break;
    }

    this.eventService.getEvents(start, end).
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
              draggable: true
            };
          });
      });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    alert("did a thing." + action);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  }

  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}