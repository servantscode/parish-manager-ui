import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

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