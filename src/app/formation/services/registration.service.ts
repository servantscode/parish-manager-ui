import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Registration } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends PaginatedService<Registration> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/registration"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "registration";
  }

  public getTemplate(): Registration {
    return new Registration().asTemplate();
  }
}
