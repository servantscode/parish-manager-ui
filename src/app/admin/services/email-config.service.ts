import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';

import { EmailConfig } from '../email-config';

@Injectable({
  providedIn: 'root'
})
export class EmailConfigService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) {
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl('/rest/email/config');
  }

  getEmailConfig(): Observable<EmailConfig> {
    return this.http.get<EmailConfig>(this.url).pipe(
        catchError(this.handleError('getEmailConfig', null))
      );
  }

  setEmailConfig(config: EmailConfig): Observable<void> {
    return this.http.put<void>(this.url, config, this.httpOptions).pipe(
        tap(item => this.log('Email settings saved.')),
        catchError(this.handleError('setEmailConfig', null))
      );
  }

  deleteEmailConfig(): Observable<void> {
    return this.http.delete<void>(this.url).pipe(
        tap(item => this.log('Email settings deleted.')),
        catchError(this.handleError('deleteEmailConfig', null))
      );
  }
}
