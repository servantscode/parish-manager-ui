import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
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
              protected router: Router) { 
    super(apiService.prefaceUrl("/rest/event"), http, messageService, router);
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

  public getFutureTimes(id:number): Observable<Date[]> {
    return this.http.get<Date[]>(this.url+`/${id}/futureTimes`).pipe(
        catchError(this.handleError('getFutureTimes', []))
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
}
