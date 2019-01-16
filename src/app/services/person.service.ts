import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { BaseService } from './base.service';

import { Person } from '../person';
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
export class PersonService extends BaseService {
  private url = 'http://localhost/rest/person'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getPeople(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Person>> {
    return this.http.get<PaginatedResponse<Person>>(this.url+`?start=${start}&count=${count}&partial_name=${search}&families=true`).pipe(
        catchError(this.handleError('getPeople', null))
      );
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getPerson', null))
      );
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.url, person, httpOptions).pipe(
        tap(person => this.log('Created person ' + person.name)),
        catchError(this.handleError('createPerson', null))
      );
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(this.url, person, httpOptions).pipe(
        tap(person => this.log('Updated person ' + person.name)),
        catchError(this.handleError('updatePerson', null))
      );
  }
}
