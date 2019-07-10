import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

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
