import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from '../../sccommon/services/base.service';

import { Event } from '../event';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService { 
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService);
    this.url = apiService.prefaceUrl("/rest/event");
  }

  getEvents(startTime:Date, endTime:Date, search = ''): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`?start_date=${startTime.toISOString()}&end_date=${endTime.toISOString()}&partial_description=${search}`).pipe(
        catchError(this.handleError('getEvents', null))
      );
  }

  getUpcomingEvents(ministryId:number, count:number = 10): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`/ministry/${ministryId}?count=${count}`).pipe(
        catchError(this.handleError('getUpcomingEvents', null))
      );
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getEvent', null))
      );
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.url, event, httpOptions).pipe(
        tap(event => this.log('Created event ' + event.description)),
        catchError(this.handleError('createEvent', null))
      );
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(this.url, event, httpOptions).pipe(
        tap(event => this.log('Updated event ' + event.description)),
        catchError(this.handleError('updateEvent', null))
      );
  }

  deleteEvent(id: number, description: string): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}`).pipe(
        tap(event => this.log('Deleted event ' + description)),
        catchError(this.handleError('deleteEvent', null))
      );
  }
}
