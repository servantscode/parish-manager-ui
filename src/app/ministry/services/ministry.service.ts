import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Identity } from '../../sccommon/identity';

import { Ministry } from '../ministry';

export enum ContactType {
  CONTACTS,
  LEADERS,
  ALL
}

@Injectable({
  providedIn: 'root'
})
export class MinistryService extends PaginatedService<Ministry> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/ministry"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "ministry";
  }

  public getTemplate(): Ministry {
    return new Ministry().asTemplate();
  }

  public getReport(search = ''): Observable<any> {
    return this.http.get(this.url + `/report?search=${encodeURI(search)}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('ministryReport', null))
      );
  }

  public getEmailList(ministryId: number, contactType: ContactType): Observable<string[]> {
    return this.http.get<string[]>(this.url + `/${ministryId}/email/${ContactType[contactType]}`).pipe(
        catchError(this.handleError('getEmailList', []))
      );
  }

  public getPrimaryContact(ministryId: number): Observable<number> {
    return this.http.get<number>(this.url + `/${ministryId}/contacts`).pipe(
        map(resp => resp[0].id),
        catchError(this.handleError('getEmailList', []))
      );
  }
}
