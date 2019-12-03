import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';
import { Automation } from '../integration';

@Injectable({
  providedIn: 'root'
})
export class AutomationService extends PaginatedService<Automation> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/integration/automation"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.integration.automation";
  }

  public getTemplate(): Automation {
    return new Automation().asTemplate();
  }
}
