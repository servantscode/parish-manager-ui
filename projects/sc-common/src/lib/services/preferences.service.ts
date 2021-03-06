import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { ApiLocatorService } from './api-locator.service';
import { LoginService } from './login.service';
import { PaginatedService } from './paginated.service';

import { Preference } from '../preference';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService extends PaginatedService<Preference> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/preference'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.preference";
  }

  public getTemplate(): Preference {
    return new Preference().asTemplate();
  }

  getObjectTypes(): Observable<string[]> {
    return this.http.get(this.url + '/objectTypes').pipe(
        catchError(this.handleError('Object Types', null))
      );
  }

  getPreferenceTypes(): Observable<string[]> {
    return this.http.get(this.url + '/preferenceTypes').pipe(
        catchError(this.handleError('Preference Types', null))
      );
  }

}
