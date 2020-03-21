import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../services/api-locator.service';
import { LoginService } from '../services/login.service';
import { MessageService } from '../services/message.service';
import { PaginatedService } from '../services/paginated.service';

import { PaginatedResponse } from '../paginated-response';
import { Family } from '../family';

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends PaginatedService<Family> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/family'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "family";
  }

  public getTemplate(): Family {
    return new Family().asTemplate();
  }

  get(id: number, includeInactive=false): Observable<Family> {
    return this.http.get<Family>(this.url + `/${id}?include_inactive=${includeInactive}`).pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('get', null))
      );
  }

  public getPage(start = 0, count = 10, search = '', includeInactive=false, includeFamilyMembers=false): Observable<PaginatedResponse<Family>> {
    return this.http.get<PaginatedResponse<Family>>(this.url+`?start=${start}&count=${count}&search=${encodeURIComponent(search)}&include_inactive=${includeInactive}&members=${includeFamilyMembers}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  public attachPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/photo`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        catchError(this.handleError('attachPhoto', null))
      );
  }

  public getReport(search = '', includeInactive=false): Observable<any> {
    return this.http.get(this.url + `/report?search=${encodeURIComponent(search)}&include_inactive=${includeInactive}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('familyReport', null))
      );
  }

  public getPreferences(id: number) {
    return this.http.get<any>(this.url+`/${id}/preferences`).pipe(
        catchError(this.handleError('getPreferences', null))
      );
  }

  public updatePreferences(id: number, preferences: any) {
    return this.http.put<void>(this.url+`/${id}/preferences`, preferences, this.httpOptions).pipe(
        catchError(this.handleError('updatePreferences', null))
      );
  }

  public getNextEnvelope(): Observable<number> {
    return this.http.get<number>(this.url+`/nextEnvelope`, this.httpOptions).pipe(
        catchError(this.handleError('getNextEnvelope', null))
      );    
  }
}
