import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService } from 'sc-common';

import { Registration } from 'sc-common';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends PaginatedService<Registration> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/registration"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "registration";
  }

  public getTemplate(): Registration {
    return new Registration().asTemplate();
  }
}
