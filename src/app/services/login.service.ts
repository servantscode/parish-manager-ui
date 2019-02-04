import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequest } from '../credentialRequest';

import { MessageService } from './message.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {
  private url = 'http://localhost:8080/rest/login'

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              private jwtHelper: JwtHelperService) {
    super(http, messageService);
  }

  public loginEmitter = new EventEmitter<string>();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  public login(credentials: any): Observable<string> {
    return this.http.post(this.url, credentials, {
                        headers: new HttpHeaders({
                          'Content-Type': 'application/json',
                          'Accept': 'text/plain'
                        }),
                        responseType: 'text'
                      })
      .pipe(
        tap(resp => this.doLogin(resp)),
        tap(() => this.log('Logged in as: ' + credentials.email))
      );
  }

  public createCredentials(request: CredentialRequest): Observable<void> {
    return this.http.post(this.url + "/new", request, this.httpOptions)
      .pipe(
        catchError(this.handleError('create credentials', null))
      );
  }

  public getCredentials(personId: number): Observable<any> {
    return this.http.get(this.url + "/person/" + personId, {
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

  public logout() {
    localStorage.removeItem("jwt-token");
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt-token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getUserName(): string {
    return this.decodeUserName(localStorage.getItem('jwt-token'));
  }

  public getUserId(): string {
    const decoded = this.jwtHelper.decodeToken(localStorage.getItem('jwt-token'));
    return decoded == null? "": decoded.userId;
  }

  // ----- Private -----

  private doLogin(token: string) {
    localStorage.setItem('jwt-token', token);
    this.loginEmitter.emit(this.decodeUserName(token));
  }

  private decodeUserName(token: string): string {
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded == null? "": decoded.sub;
  }
}