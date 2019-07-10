import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from './api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from './base.service';

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


}
