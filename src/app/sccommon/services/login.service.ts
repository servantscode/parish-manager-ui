import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiLocatorService } from './api-locator.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              private jwtHelper: JwtHelperService,
              protected apiService: ApiLocatorService) { 
    this.url = apiService.prefaceUrl("/rest/login");
  }

  public loginEmitter = new EventEmitter<string>();

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
        tap(() => this.messageService.add('Logged in as: ' + credentials.email))
      );
  }

  public logout() {
    localStorage.removeItem("jwt-token");
    this.router.navigate(['login']);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public getUserName(): string {
    const decoded = this.getDecodedToken();
    return decoded? decoded.sub: "";
  }

  public getUserId(): number {
    const decoded = this.getDecodedToken();
    return decoded? +decoded.userId: 0;
  }

  public hasAny(permPrefix: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded && decoded.permissions.some(userPerm => this.matches(userPerm, permPrefix, true));
  }

  public isSystem(): boolean {
    const decoded = this.getDecodedToken();
    return decoded.permissions.length == 1 && decoded.permissions[0] == "*";
  }

  public userCan(reqPerm: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded && decoded.permissions.some(userPerm => this.matches(userPerm, reqPerm));
  }

  public userMust(reqPerm: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded && decoded.permissions.length == 1 && decoded.permissions.some(userPerm => userPerm == reqPerm);
  }


  public matches(userPerm: string, permRequest: string, matchAny = false): boolean {
      return this.matchesInternal(userPerm.split(/\./), permRequest.split(/\./), 0, matchAny);
  }

  // ----- Private -----
  private getToken() {
    return localStorage.getItem('jwt-token');
  }

  private getDecodedToken() {
    const token = this.getToken();
    if(token == null || this.jwtHelper.isTokenExpired(token))
      this.router.navigate(['login']);
    return token? this.jwtHelper.decodeToken(token): null;
  }

  private matchesInternal(userPerm: string[], permRequest: string[], index: number, matchAny: boolean): boolean {
      if(userPerm[index] === "*")
          return true;
      else if(!(userPerm[index] === permRequest[index]))
          return false;

      if(index + 1 === userPerm.length)
          return true;
      else if(index + 1 === permRequest.length)
          return matchAny;

      return this.matchesInternal(userPerm, permRequest, index + 1, matchAny);
  }

  private doLogin(token: string) {
    localStorage.setItem('jwt-token', token);

    const decoded = this.jwtHelper.decodeToken(token);
    this.loginEmitter.emit(decoded? decoded.sub: "");
  }
}