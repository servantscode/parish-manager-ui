import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedResponse, PaginatedService } from 'sc-common';

import { Checkin } from '../checkin';

@Injectable({
  providedIn: 'root'
})
export class CheckinService extends PaginatedService<Checkin> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/checkin"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.checkin";
  }

  public getTemplate(): Checkin {
    return new Checkin().asTemplate();
  }

  public getActiveCheckins(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<Checkin>> {
    return this.http.get<PaginatedResponse<Checkin>>(this.modifyUrl(this.url+"/active", pathVars)+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getActiveCheckins', null))
      );
  }
}
