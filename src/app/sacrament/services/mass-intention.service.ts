import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { MassIntention } from '../sacrament';

@Injectable({
  providedIn: 'root'
})
export class MassIntentionService extends PaginatedService<MassIntention> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/sacrament/mass/intention"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "sacrament.mass.intention";
  }

  public deleteRequiresAdmin(): boolean {
    return true;
  }

  public getTemplate(): MassIntention {
    return new MassIntention().asTemplate();
  }

  getIntentionTypes(): Observable<string[]> {
    return this.http.get(this.url + '/types').pipe(
        catchError(this.handleError('getIntentionTypes', null))
      );
  }
}
