import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError} from 'rxjs/operators';
import { startOfDay, endOfDay } from 'date-fns';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { MessageService } from '../../sccommon/services/message.service';

import { Reservation } from '../reservation';
import { Event, EventConflict } from '../event';
import { AvailabilityResponse } from '../availability-response';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              protected apiService: ApiLocatorService) {
    super(http, messageService, router);
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
