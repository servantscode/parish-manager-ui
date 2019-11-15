import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';
import { AvailableIntegration } from '../integration';

@Injectable({
  providedIn: 'root'
})
export class AvailableIntegrationService extends PaginatedService<AvailableIntegration> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/integration/available"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.integration";
  }

  public getTemplate(): AvailableIntegration {
    return new AvailableIntegration().asTemplate();
  }
}
