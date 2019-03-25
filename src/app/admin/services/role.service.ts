import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends PaginatedService<Role> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(apiService.getServiceUrl("role"), http, messageService);
  }

  public getPermissionType(): string {
    return "admin.role";
  }

  public getTemplate(): Role {
    return new Role().asTemplate();
  }
}