import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { startOfDay, endOfDay } from 'date-fns';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { BaseService } from 'sc-common';
import { LoginService } from 'sc-common';

import { Reservation } from '../../sccommon/reservation';
import { Event, EventConflict } from '../../sccommon/event';
import { AvailabilityResponse } from '../availability-response';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) {
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl("/rest/reservation");
  }

  getReservations(res: Reservation, startDate?: Date, endDate?: Date): Observable<Reservation[]> {
    var params = `?resourceType=${res.resourceType}&resourceId=${res.resourceId}`+
                 `&startTime=${startOfDay(startDate? startDate: res.startTime).toISOString()}&`+
                 `endTime=${endOfDay(endDate? endDate: res.endTime).toISOString()}`;
    return this.http.get<Reservation[]>(this.url+params).pipe(
        catchError(this.handleError('getReservations', []))
      );
  }

  getConflicts(event: Event): Observable<EventConflict[]> {
    return this.http.post<EventConflict[]>(this.url+"/recurring", event, this.httpOptions).pipe(
      catchError(this.handleError('getConflicts', []))
    );
  }

  getCustomEventConflicts(events: Event[]): Observable<EventConflict[]> {
    return this.http.post<EventConflict[]>(this.url+"/custom", events, this.httpOptions).pipe(
      catchError(this.handleError('getCustomEventConflicts', []))
    );
  }
}
