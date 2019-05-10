import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { MassIntention } from '../sacrament';

@Injectable({
  providedIn: 'root'
})
export class MassIntentionService extends PaginatedService<MassIntention> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl("/rest/sacrament/mass/intention"), http, messageService);
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
