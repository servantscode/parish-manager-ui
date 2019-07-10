import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { PaginatedResponse } from '../../sccommon/paginated.response'

import { Event } from '../event';

@Injectable({
  providedIn: 'root'
})
export class EventService extends PaginatedService<Event> { 

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/event"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "event";
  }

  public getTemplate(): Event {
    return new Event().asTemplate();
  }

  public timeRangeQuery(search: string, startTime: Date, endTime: Date): string {
    return `${search} startTime:[* TO ${endTime.toISOString()}] endTime:[${startTime.toISOString()} TO *]`;
  }

  public getPage(start = 0, count = 0, search = '', pathVars?: any): Observable<PaginatedResponse<Event>> {
    return this.http.get<PaginatedResponse<Event>>(this.modifyUrl(this.url, pathVars)+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  public getFutureEvents(id:number): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`/${id}/futureEvents`).pipe(
        catchError(this.handleError('getFutureEvents', []))
      );
  }

  public calculateFutureTimes(e: Event): Observable<Date[]> {
    return this.http.post<Date[]>(this.url+`/futureTimes`, e, this.httpOptions).pipe(
        catchError(this.handleError('calculateFutureTimes', null))
      );
  }

  public getUpcomingEvents(ministryId:number, count:number = 10): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`/ministry/${ministryId}?count=${count}`).pipe(
        catchError(this.handleError('getUpcomingEvents', null))
      );
  }
  
  delete(item: Event, deleteFutureEvents: boolean = false, deletePermenantly: boolean = false, pathVars?: any): Observable<void> {
    var finalUrl = this.modifyUrl(this.url, pathVars) + `/${item.id}?deleteFutureEvents=${deleteFutureEvents}`;
    if(deletePermenantly) finalUrl += "&delete_permenantly=true";
    return this.http.delete<void>(finalUrl).pipe(
        tap(item => this.log('Deleted!')),
        catchError(this.handleError('delete', null))
      );
  }

  createSeries(events: Event[]): Observable<Event> {
    return this.http.post<Event>(this.url + '/series', events, this.httpOptions).pipe(
        map(resp => this.mapObject(resp)),
        tap(item => this.log('Created!')),
        catchError(this.handleError('createEventSeries', null))
      );
  }

  updateSeries(events: Event[]): Observable<Event> {
    return this.http.put<Event>(this.url + '/series', events, this.httpOptions).pipe(
        map(resp => this.mapObject(resp)),
        tap(item => this.log('Updated!')),
        catchError(this.handleError('updateEventSeries', null))
      );
  }

}
