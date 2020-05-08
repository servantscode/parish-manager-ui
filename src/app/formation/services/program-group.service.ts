import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService } from 'sc-common';

import { ProgramGroup } from 'sc-common';

@Injectable({
  providedIn: 'root'
})
export class ProgramGroupService extends PaginatedService<ProgramGroup> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/group"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "program.group";
  }

  public getTemplate(): ProgramGroup {
    return new ProgramGroup().asTemplate();
  }
}