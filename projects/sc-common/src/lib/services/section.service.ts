import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { ApiLocatorService } from './api-locator.service';
import { LoginService } from './login.service';
import { PaginatedService } from './paginated.service';

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