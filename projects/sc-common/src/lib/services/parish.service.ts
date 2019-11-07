import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService } from './api-locator.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';
import { PaginatedService } from './paginated.service';

import { Parish } from '../parish';

@Injectable({
  providedIn: 'root'
})
export class ParishService extends PaginatedService<Parish> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/parish"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "parish";
  }

  public getTemplate(): Parish {
    return new Parish().asTemplate();
  }

  public getActiveParish(): Observable<Parish> {
    return this.http.get<Parish>(this.url + "/active").pipe(
        catchError(this.handleError('getActiveParish', null))
      );
  }

  public attachBannerPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/bannerPhoto`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        catchError(this.handleError('attachBannerPhoto', null))
      );
  }

  public attachPortraitPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/portraitPhoto`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        catchError(this.handleError('attachPortraitPhoto', null))
      );
  }
}
