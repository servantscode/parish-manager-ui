import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Credentials } from '../credentials';
import { CredentialRequest } from '../credential-request';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class CredentialService extends PaginatedService<Credentials> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(apiService.prefaceUrl("/rest/credentials"), http, messageService);
  }

  public getPermissionType(): string {
    return "admin.login";
  }

  public getTemplate(): Credentials {
    return new Credentials().asTemplate();
  }

  public getCredsPage(role:string, start = 0, count = 10, search = ''): Observable<PaginatedResponse<Credentials>> {
    return this.http.get<PaginatedResponse<Credentials>>(this.url+`/role/${role}?start=${start}&count=${count}&partial_name=${search}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }
}