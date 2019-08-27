import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Session } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends PaginatedService<Session> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/session"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "session";
  }

  public getTemplate(): Session {
    return new Session().asTemplate();
  }
}