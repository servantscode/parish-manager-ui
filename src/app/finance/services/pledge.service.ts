import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { PaginatedResponse } from 'sc-common';

import { Pledge } from '../pledge';

@Injectable({
  providedIn: 'root'
})
export class PledgeService extends PaginatedService<Pledge> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/pledge"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "pledge";
  }

  public getTemplate(): Pledge {
    return new Pledge().asTemplate();
  }

  getPage(start?: number, count?: number, search?: string): Observable<PaginatedResponse<Pledge>> {
    alert("Not implemented!!");
    return null;
  }

  getPledges(familyId: number): Observable<Pledge[]> {
    return this.http.get<Pledge[]>(this.url+`/family/${familyId}`).pipe(
        catchError(this.handleError('getPledge', null))
      );
  }

  getPledgeTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.url+`/types`).pipe(
        catchError(this.handleError('getPledgeTypes', null))
      );
  }

  getPledgeFrequencies(): Observable<string[]> {
    return this.http.get<string[]>(this.url+`/freqs`).pipe(
        catchError(this.handleError('getPledgeFrequencies', null))
      );
  }
}
