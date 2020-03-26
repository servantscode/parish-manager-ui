import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Classroom } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService extends PaginatedService<Classroom> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/classroom"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "classroom";
  }

  public getTemplate(): Classroom {
    return new Classroom().asTemplate();
  }
}
