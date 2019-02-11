import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { BaseService } from './base.service';

import { PaginatedResponse } from '../paginated.response';
import { Identifiable } from '../identifiable';

export abstract class PaginatedService<T extends Identifiable> extends BaseService {
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(protected url: string,
              protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  public abstract getPermissionType(): string;

  public getPage(start = 0, count = 10, search = ''): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(this.url+`?start=${start}&count=${count}&partial_name=${search}`).pipe(
        catchError(this.handleError('getPage', null))
      );
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(this.url + `/${id}`).pipe(
        catchError(this.handleError('get', null))
      );
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.url, item, this.httpOptions).pipe(
        tap(item => this.log('Created!')),
        catchError(this.handleError('create', null))
      );
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(this.url, item, this.httpOptions).pipe(
        tap(item => this.log('Updated!')),
        catchError(this.handleError('update', null))
      );
  }
}
