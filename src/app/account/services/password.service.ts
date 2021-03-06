import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { BaseService } from 'sc-common';

import { PasswordRequest } from '../password-request';

@Injectable({
  providedIn: 'root'
})
export class PasswordService extends BaseService {

  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) {
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl('/rest/password');
  }

  updatePassword(req: PasswordRequest): Observable<void> {
    return this.http.post(this.url, req, this.httpOptions).pipe(
        tap(item => this.log('Password reset!')),
        catchError(this.handleError('password reset', null))
      );
  }

  requestReset(req: any): Observable<void> {
    return this.http.post(this.url + "/reset", req, this.httpOptions).pipe(
        tap(item => this.log('Password reset requested!')),
        catchError(this.handleError('request password reset', null))
      );
  }

}
