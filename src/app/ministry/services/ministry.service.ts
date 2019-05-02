import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Ministry } from '../ministry';

@Injectable({
  providedIn: 'root'
})
export class MinistryService extends PaginatedService<Ministry> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl("/rest/ministry"), http, messageService);
  }

  public getPermissionType(): string {
    return "ministry";
  }

  public getTemplate(): Ministry {
    return new Ministry().asTemplate();
  }

  public getReport(search = ''): Observable<any> {
    return this.http.get(this.url + `/report?search=${search}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('ministryReport', null))
      );
  }
}
