import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService } from 'sc-common';
import { SystemIntegration } from '../system-integration';

@Injectable({
  providedIn: 'root'
})
export class SystemIntegrationService extends PaginatedService<SystemIntegration> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/systemIntegration"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "system.integration";
  }

  public getTemplate(): SystemIntegration {
    return new SystemIntegration().asTemplate();
  }
}
