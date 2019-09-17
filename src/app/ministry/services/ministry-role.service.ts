import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { MinistryRole } from '../enrollment';

@Injectable({
  providedIn: 'root'
})
export class MinistryRoleService extends PaginatedService<MinistryRole> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/ministry/:id:/role"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "ministry.role";
  }

  public getTemplate(): MinistryRole {
    return new MinistryRole().asTemplate();
  }
}
