import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';
import { IncomingDonation } from '../incoming-donation';

@Injectable({
  providedIn: 'root'
})
export class IncomingDonationService extends PaginatedService<IncomingDonation> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/integration/donation"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "integration.donation";
  }

  public getTemplate(): IncomingDonation {
    return new IncomingDonation().asTemplate();
  }

  public create(donor: IncomingDonation): Observable<IncomingDonation> {
    alert("Not Implemented");
    return null;
  }
}