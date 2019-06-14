import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError} from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { MessageService } from '../../sccommon/services/message.service';

import { Room } from '../room';
import { Event } from '../event';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              protected apiService: ApiLocatorService) {
    super(http, messageService, router);
    this.url = apiService.prefaceUrl("/rest/availability");
  }

  getAvailableRooms(event: Event, search: string = ""): Observable<Room[]> {
    var params = `?search=${search}`+
                 `&startTime=${event.startTime.toISOString()}&`+
                 `endTime=${event.endTime.toISOString()}`;
    return this.http.get<Room[]>(this.url+"/rooms"+params).pipe(
        catchError(this.handleError('getAvailableRooms', []))
      );
  }
}
