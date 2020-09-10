import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService, PaginatedResponse } from 'sc-common';
import { Family } from 'sc-common';

import { FamilyContribution } from '../donation';

@Injectable({
  providedIn: 'root'
})
export class FamilyContributionService extends PaginatedService<FamilyContribution> {
  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/donation/family"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "donation";
  }

  public getTemplate(): FamilyContribution {
    return new FamilyContribution().asTemplate();
  }

  public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<FamilyContribution>> {
    return this.http.get<PaginatedResponse<FamilyContribution>>(this.modifyUrl(this.url, pathVars)+`?start=${start}&count=${count}&search=${encodeURIComponent(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  get(id: number, pathVars?: any): Observable<FamilyContribution> {
    alert("Not implemented");
    return null;
  }

  create(item: FamilyContribution, pathVars?: any): Observable<FamilyContribution> {
    alert("Not implemented");
    return null;
  }

  update(item: FamilyContribution, pathVars?: any): Observable<FamilyContribution> {
    alert("Not implemented");
    return null;
  }

  delete(item: FamilyContribution, deletePermenantly: boolean = false, pathVars?: any): Observable<void> {
    alert("Not implemented");
    return null;
  }

  public getReport(search = ''): Observable<any> {
    return this.http.get(this.url + `/report?search=${encodeURIComponent(search)}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('familyContributionReport', null))
      );
  }
}
