import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

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

  public hasAny(permPrefix: string): boolean {
    const token = localStorage.getItem('jwt-token');
    if(!token)
      return false;

    const decoded = this.jwtHelper.decodeToken(token);
    return decoded.permissions.some(perm => perm.startsWith(permPrefix) || perm.startsWith("*"));
  }

  public userCan(reqPerm: string): boolean {
    const decoded = this.jwtHelper.decodeToken(localStorage.getItem('jwt-token'));
    return decoded.permissions.some(userPerm => this.matches(userPerm, reqPerm));
  }

  public matches(userPerm: string, permRequest: string): boolean {
      return this.matchesInternal(userPerm.split(/\./), permRequest.split(/\./), 0);
  }

  // ----- Private -----
  private matchesInternal(userPerm: string[], permRequest: string[], index: number): boolean {
      if(userPerm[index] === "*")
          return true;
      else if(!(userPerm[index] === permRequest[index]))
          return false;

      if(index + 1 === userPerm.length)
          return true;
      else if(index + 1 === permRequest.length)
          return false;

      return this.matchesInternal(userPerm, permRequest, index + 1);
  }

  private doLogin(token: string) {
    localStorage.setItem('jwt-token', token);
    this.loginEmitter.emit(this.decodeUserName(token));
  }

  private decodeUserName(token: string): string {
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded == null? "": decoded.sub;
  }
}