import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { startOfDay, endOfDay } from 'date-fns';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { MessageService } from '../../sccommon/services/message.service';

import { Reservation } from '../reservation';
import { AvailabilityResponse } from '../availability-response';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(http, messageService);
    this.url = apiService.prefaceUrl("/rest/reservation");
  }

  getAvailability(res: Reservation): Observable<AvailabilityResponse> {
    var params = `?resourceType=${res.resourceType}&resourceId=${res.resourceId}`+
                 `&startTime=${res.startTime.toISOString()}&endTime=${res.endTime.toISOString()}`+
                 `&eventId=${res.eventId? res.eventId: 0}`
    return this.http.get<AvailabilityResponse>(this.url+"/availability"+params).pipe(
        catchError(this.handleError('getAvailability', null))
      );
  }

  getReservations(res: Reservation): Observable<Reservation[]> {
    var params = `?resourceType=${res.resourceType}&resourceId=${res.resourceId}`+
                 `&startTime=${startOfDay(res.startTime).toISOString()}&`+
                 `endTime=${endOfDay(res.endTime).toISOString()}`;
    return this.http.get<Reservation[]>(this.url+params).pipe(
        catchError(this.handleError('getReservations', []))
      );
  }
}
