import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { BaseService } from './base.service';

import { Ministry } from '../ministry';
import { PaginatedResponse } from '../paginated.response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MinistryService extends BaseService {
  private url = 'http://localhost:81/rest/ministry'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getMinistries(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Ministry>> {
    return this.http.get<PaginatedResponse<Ministry>>(this.url+`?start=${start}&count=${count}&partial_name=${search}`).pipe(
        catchError(this.handleError('getMinistries', null))
      );
  }

  getMinistry(id: number): Observable<Ministry> {
    return this.http.get<Ministry>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getMinistry', null))
      );
  }

  createMinistry(ministry: Ministry): Observable<Ministry> {
    return this.http.post<Ministry>(this.url, ministry, httpOptions).pipe(
        tap(ministry => this.log('Created ministry ' + ministry.name)),
        catchError(this.handleError('createMinistry', null))
      );
  }

  updateMinistry(ministry: Ministry): Observable<Ministry> {
    return this.http.put<Ministry>(this.url, ministry, httpOptions).pipe(
        tap(ministry => this.log('Updated ministry ' + ministry.name)),
        catchError(this.handleError('updateMinistry', null))
      );
  }
}
