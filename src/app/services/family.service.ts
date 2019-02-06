import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../sccommon/services/message.service';
import { BaseService } from '../sccommon/services/base.service';

import { Family } from '../family';
import { PaginatedResponse } from '../sccommon/paginated.response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends BaseService {
  private url = 'http://localhost/rest/family'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getFamilies(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Family>> {
    return this.http.get<PaginatedResponse<Family>>(this.url+`?start=${start}&count=${count}&partial_name=${search}`).pipe(
        catchError(this.handleError('getFamilies', null))
      );
  }

  getFamily(id: number): Observable<Family> {
    return this.http.get<Family>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getFamily', null))
      );
  }

  createFamily(family: Family): Observable<Family> {
    return this.http.post<Family>(this.url, family, httpOptions).pipe(
        tap(family => this.log('Created family ' + family.surname)),
        catchError(this.handleError('createFamily', null))
      );
  }

  updateFamily(family: Family): Observable<Family> {
    return this.http.put<Family>(this.url, family, httpOptions).pipe(
        tap(family => this.log('Updated family ' + family.surname)),
        catchError(this.handleError('updateFamily', null))
      );
  }
}
