import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';

import { Room } from '../room';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) {
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl("/rest/availability");
  }

  getAvailableRooms(startTime: Date, endTime: Date, search: string = ""): Observable<Room[]> {
    var params = `?search=${search}`+
                 `&startTime=${startTime.toISOString()}&`+
                 `endTime=${endTime.toISOString()}`;
    return this.http.get<Room[]>(this.url+"/rooms"+params).pipe(
        catchError(this.handleError('getAvailableRooms', []))
      );
  }
}
