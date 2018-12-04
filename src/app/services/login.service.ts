import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequest } from '../credentialRequest';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = 'http://localhost:8080/rest/login'

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private jwtHelper: JwtHelperService) { }

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
        tap(() => this.log('Logged in as: ' + credentials.email)),
        catchError(this.handleError('login', null))
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

  public getRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.url + "/roles", {
                        headers: new HttpHeaders({
                          'Accept': 'application/json'
                        })
                      })
      .pipe(
        catchError(this.handleError('get roles', null))
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


  // ----- Private -----

  private doLogin(token: string) {
    localStorage.setItem('jwt-token', token);
    this.loginEmitter.emit(this.decodeUserName(token));
  }

  private decodeUserName(token: string): string {
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded == null? "": decoded.sub;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.logError(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }

  private logError(message: string) {
    this.messageService.error(`LoginService: ${message}`);
  }
}