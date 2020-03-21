import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { PaginatedResponse } from 'sc-common';

import { Credentials } from '../credentials';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class CredentialService extends PaginatedService<Credentials> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/credentials"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.login";
  }

  public getTemplate(): Credentials {
    return new Credentials().asTemplate();
  }

  public getCredsPage(role:string, start = 0, count = 10, search = ''): Observable<PaginatedResponse<Credentials>> {
    return this.http.get<PaginatedResponse<Credentials>>(this.url+`/role/${role}?start=${start}&count=${count}&search=${encodeURIComponent(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }
}
