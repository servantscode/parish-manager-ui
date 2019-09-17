import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { SacramentalGroup } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class SacramentalGroupService extends PaginatedService<SacramentalGroup> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/sacramental-group"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "sacramental-group";
  }

  public getTemplate(): SacramentalGroup {
    return new SacramentalGroup().asTemplate();
  }
}