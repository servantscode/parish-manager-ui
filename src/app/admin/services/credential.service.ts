import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { BaseService } from '../../sccommon/services/base.service';
import { MessageService } from '../../sccommon/services/message.service';
// import { PaginatedService } from '../../sccommon/services/paginated.service';
import { Credentials } from '../credentials';
import { CredentialRequest } from '../credential-request';

@Injectable({
  providedIn: 'root'
})
// export class CredentialService extends PaginatedService<Credentials> {
export class CredentialService extends BaseService {
  private url = 'http://localhost:8080/rest/login';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };


  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super(http, messageService);
  }

  public getPermissionType(): string {
    return "admin.login";
  }

  public createCredentials(request: CredentialRequest): Observable<void> {
    return this.http.post(this.url + "/new", request, this.httpOptions)
      .pipe(
        catchError(this.handleError('create credentials', null))
      );
  }

  public getCredentials(personId: number): Observable<Credentials> {
    return this.http.get<Credentials>(this.url + "/person/" + personId, {
                        headers: new HttpHeaders({
                          'Accept': 'application/json'
                        })
                      });
  }

  public deleteCredentials(personId: number): Observable<boolean> {
    return this.http.delete<any>(this.url + "/person/" + personId, {
                        headers: new HttpHeaders({
                          'Accept': 'application/json'
                        })
                      })
      .pipe(
        map(resp => resp.success),
        catchError(this.handleError('revoke credentials', false))
      );
  }
}