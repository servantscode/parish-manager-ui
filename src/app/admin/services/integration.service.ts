import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';
import { Integration } from '../integration';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService extends PaginatedService<Integration> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/integration"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.integration";
  }

  public getTemplate(): Integration {
    return new Integration().asTemplate();
  }

  public syncPushpay(): Observable<void> {
    return this.http.post<void>(this.url + "/pushpay/payment/sync", null, this.httpOptions).pipe(
        catchError(this.handleError('syncPushpay', null))
      );
  }
}
