import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { PaginatedResponse } from '../../sccommon/paginated.response'

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
export class EventService extends PaginatedService<Event> { 

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl("/rest/event"), http, messageService);
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

  public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<Event>> {
    return this.http.get<PaginatedResponse<Event>>(this.modifyUrl(this.url, pathVars)+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }


  getUpcomingEvents(ministryId:number, count:number = 10): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`/ministry/${ministryId}?count=${count}`).pipe(
        catchError(this.handleError('getUpcomingEvents', null))
      );
  }
}
