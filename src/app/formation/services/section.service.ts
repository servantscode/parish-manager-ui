import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Section } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends PaginatedService<Section> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/section"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "section";
  }

  public getTemplate(): Section {
    return new Section().asTemplate();
  }
}