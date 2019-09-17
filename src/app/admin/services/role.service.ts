import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';


import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends PaginatedService<Role> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/role"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.role";
  }

  public getTemplate(): Role {
    return new Role().asTemplate();
  }
}