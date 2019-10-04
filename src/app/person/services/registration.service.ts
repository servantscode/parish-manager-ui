import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService } from 'sc-common';
import { Family } from 'sc-common';

import { RegistrationRequest } from '../registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends PaginatedService<RegistrationRequest> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/registration"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "registration.request";
  }

  public setStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(this.url + `/${id}/status/${status}`, null, this.httpOptions).pipe(
        catchError(this.handleError('update', null))
      );
  }

  public getPossibleMatches(id: number): Observable<Family[]> {
    return this.http.get<Family[]>(this.url + `/${id}/matches`, this.httpOptions).pipe(
        map(resp => resp.map(fam => this.mapFamily(fam))),
        catchError(this.handleError('getPossibleMatches', null))
      );
  }

  private mapFamily(input: Family) {
    var resp = new Family().asTemplate();
    for (let key of Object.keys(resp))
        resp[key] = input[key];
    return resp;
  }

  public getTemplate(): RegistrationRequest {
    return new RegistrationRequest().asTemplate();
  }
}