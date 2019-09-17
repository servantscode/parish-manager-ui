import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { PaginatedResponse } from 'sc-common';

import { Fund } from '../fund';

@Injectable({
  providedIn: 'root'
})
export class FundService extends PaginatedService<Fund> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/fund"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "donation";
  }

  public getTemplate(): Fund {
    return new Fund().asTemplate();
  }
}
