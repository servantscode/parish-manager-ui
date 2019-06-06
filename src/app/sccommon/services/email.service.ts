import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from './api-locator.service';
import { MessageService } from './message.service';
import { BaseService } from './base.service';

import { Email } from '../email';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, router);
    this.url = apiService.prefaceUrl("/rest/email");
  }

  public sendEmail(email: Email): Observable<string> {
    return this.http.post(this.url, email, this.httpOptions).pipe(
        catchError(this.handleError('sendEmail', null))
      );
  }


}
