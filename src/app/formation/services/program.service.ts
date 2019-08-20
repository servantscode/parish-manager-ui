import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Program } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends PaginatedService<Program> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "program";
  }

  public getTemplate(): Program {
    return new Program().asTemplate();
  }
}