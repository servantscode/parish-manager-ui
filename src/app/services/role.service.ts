import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { BaseService } from './base.service';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  private url = 'http://localhost:8080/rest/role'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super(http, messageService);
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  };

  public getRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.url, {
                        headers: new HttpHeaders({
                          'Accept': 'application/json'
                        })
                      })
      .pipe(
        catchError(this.handleError('get roles', null))
      );
  }

  public createRole(request: Role): Observable<void> {
    return this.http.post(this.url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError('create credentials', null))
      );
  }

  public updateRole(request: Role): Observable<void> {
    return this.http.put(this.url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError('update credentials', null))
      );
  }


  public deleteRole(roleId: number): Observable<boolean> {
    return this.http.delete<any>(this.url + "/" + roleId, this.httpOptions)
      .pipe(
        catchError(this.handleError('revoke credentials', false))
      );
  }
}