import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { MessageService } from './message.service';

import { LoginService } from './login.service';
import { BaseService } from './base.service';

import { PaginatedResponse } from '../paginated-response';
import { Identifiable } from '../identifiable';

export abstract class PaginatedService<T extends Identifiable> extends BaseService {

  constructor(protected url: string,
              protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService) { 
    super(http, messageService, loginService);
  }

  public abstract getPermissionType(): string;

  public abstract getTemplate(): T;

  public deleteRequiresAdmin(): boolean {
    return false;
  }

  public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(this.modifyUrl(this.url, pathVars)+`?start=${start}&count=${count}&search=${encodeURIComponent(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  get(id: number, pathVars?: any): Observable<T> {
    return this.http.get<T>(this.modifyUrl(this.url, pathVars) + `/${id}`).pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('get', null))
      );
  }

  create(item: T, pathVars?: any): Observable<T> {
    return this.http.post<T>(this.modifyUrl(this.url, pathVars), item, this.httpOptions).pipe(
        map(resp => this.mapObject(resp)),
        tap(item => this.log('Created!')),
        catchError(this.handleError('create', null))
      );
  }

  update(item: T, pathVars?: any): Observable<T> {
    return this.http.put<T>(this.modifyUrl(this.url, pathVars), item, this.httpOptions).pipe(
        map(resp => this.mapObject(resp)),
        tap(item => this.log('Updated!')),
        catchError(this.handleError('update', null))
      );
  }

  delete(item: T, deletePermenantly: boolean = false, pathVars?: any): Observable<void> {
    var finalUrl = this.modifyUrl(this.url, pathVars) + `/${item.id}`;
    if(deletePermenantly) finalUrl += "?delete_permenantly=true";
    return this.http.delete<void>(finalUrl).pipe(
        tap(item => this.log('Deleted!')),
        catchError(this.handleError('delete', null))
      );
  }

  protected mapResults(resp: PaginatedResponse<T>): PaginatedResponse<T> {
    resp.results = this.mapObjects(resp.results);
    return resp;
  }

  protected mapObjects(results: T[]): T[] {
    return results.map(result => this.mapObject(result));
  }

  protected mapObject(obj: T): T {
    if(!obj)
      return null;
    
    var resp: T = this.getTemplate();
    for(let key of Object.keys(resp))
      resp[key] = obj[key];
    return resp;
  }
}
