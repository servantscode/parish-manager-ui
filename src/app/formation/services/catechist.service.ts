import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Catechist } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class CatechistService extends PaginatedService<Catechist> {
  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/catechist"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "catechist";
  }

  public getTemplate(): Catechist {
    return new Catechist().asTemplate();
  }
}
