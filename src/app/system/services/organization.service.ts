import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Organization } from '../organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends PaginatedService<Organization> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected router: Router) { 
    super(apiService.prefaceUrl("/rest/organization"), http, messageService, router);
  }

  public getPermissionType(): string {
    return "system.organization";
  }

  public getTemplate(): Organization {
    return new Organization().asTemplate();
  }
}
