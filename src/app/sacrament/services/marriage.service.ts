import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { BaseSacramentService } from './base-sacrament.service';

import { Marriage } from '../sacrament';

@Injectable({
  providedIn: 'root'
})
export class MarriageService extends BaseSacramentService<Marriage> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected router: Router) { 
    super(apiService.prefaceUrl("/rest/sacrament/marriage"), http, messageService, router);
  }

  public getPermissionType(): string {
    return "sacrament.marriage";
  }

  public getTemplate(): Marriage {
    return new Marriage().asTemplate();
  }
}