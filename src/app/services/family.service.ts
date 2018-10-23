import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Family } from '../family';
import { FamilyResponse } from '../familyResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private url = 'http://localhost/rest/family'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getFamilies(start = 0, count = 10, search = ''): Observable<FamilyResponse> {
    return this.http.get<FamilyResponse>(this.url+`?start=${start}&count=${count}&partial_name=${search}`).pipe(
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
    this.messageService.error(`FamilyService: ${message}`);
  }
}
