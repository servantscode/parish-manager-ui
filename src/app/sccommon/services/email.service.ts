import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { BaseService } from 'sc-common';

import { Email } from '../email';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl("/rest/email");
  }

  public sendEmail(email: Email): Observable<string> {
    return this.http.post(this.url, email, this.httpOptions).pipe(
        catchError(this.handleError('sendEmail', null))
      );
  }

  public getSendConfig(): Observable<string> {
    return this.http.get(this.url + "/sendConfig", this.httpOptions).pipe(
        map(r => r['sendFromUser']),
        catchError(this.handleError('getSendConfig', null))
      );
  }
}
