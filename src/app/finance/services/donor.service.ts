import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';
import { Donor } from '../incoming-donation';

@Injectable({
  providedIn: 'root'
})
export class DonorService extends PaginatedService<Donor> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/integration/donor"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "integration.donor";
  }

  public getTemplate(): Donor {
    return new Donor().asTemplate();
  }

  public create(donor: Donor): Observable<Donor> {
    alert("Not Implemented");
    return null;
  }
}