import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';

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
    this.url = apiService.getServiceUrl("availability");
  }

  getAvailability(res: Reservation): Observable<AvailabilityResponse> {
    var params = `?resourceType=${res.resourceType}&resourceId=${res.resourceId}`+
                 `&startTime=${res.startTime.toISOString()}&endTime=${res.endTime.toISOString()}`+
                 `&eventId=${res.eventId? res.eventId: 0}`
    return this.http.get<AvailabilityResponse>(this.url+params).pipe(
        catchError(this.handleError('getAvailability', null))
      );
  }
}
