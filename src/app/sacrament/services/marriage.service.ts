import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { BaseSacramentService } from './base-sacrament.service';

import { Marriage } from '../sacrament';

@Injectable({
  providedIn: 'root'
})
export class MarriageService extends BaseSacramentService<Marriage> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/sacrament/marriage"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "sacrament.marriage";
  }

  public getTemplate(): Marriage {
    return new Marriage().asTemplate();
  }
}