import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from '../../sccommon/services/base.service';

import { PasswordRequest } from '../password-request';

@Injectable({
  providedIn: 'root'
})
export class PasswordService extends BaseService {

  private url: string;

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(http, messageService);
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
