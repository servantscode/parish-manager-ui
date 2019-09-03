import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Person } from '../person';

import { PreferenceSource } from '../preference';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends PaginatedService<Person> implements PreferenceSource {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/person'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "person";
  }

  public getTemplate(): Person {
    return new Person().asTemplate();
  }
   
  public getPage(start = 0, count = 10, search = '', includeInactive=false): Observable<PaginatedResponse<Person>> {
    return this.http.get<PaginatedResponse<Person>>(this.url+`?start=${start}&count=${count}&search=${encodeURI(search)}&families=true&include_inactive=${includeInactive}`).pipe(
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
    return this.http.get(this.url + `/report?search=${encodeURI(search)}&include_inactive=${includeInactive}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('personReport', null))
      );
  }

  getMaritalStatuses(): Observable<string[]> {
    return this.http.get(this.url + '/maritalStatuses').pipe(
        catchError(this.handleError('getMaritalStatuses', null))
      );
  }

  getEthnicities(): Observable<string[]> {
    return this.http.get(this.url + '/ethnicities').pipe(
        catchError(this.handleError('getEthnicities', null))
      );
  }

  getLanguages(): Observable<string[]> {
    return this.http.get(this.url + '/languages').pipe(
        catchError(this.handleError('getLanguages', null))
      );
  }

  getReligions(): Observable<string[]> {
    return this.http.get(this.url + '/religions').pipe(
        catchError(this.handleError('getReliginos', null))
      );
  }

  getSpecialNeeds(): Observable<string[]> {
    return this.http.get(this.url + '/specialNeeds').pipe(
        catchError(this.handleError('getSpecialNeeds', null))
      );
  }

  getPhoneNumberTypes(): Observable<string[]> {
    return this.http.get(this.url + '/phoneNumberTypes').pipe(
        catchError(this.handleError('getPhoneNumberTypes', null))
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
}
