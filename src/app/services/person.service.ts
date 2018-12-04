import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Person } from '../person';
import { PersonResponse } from '../personResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private url = 'http://localhost/rest/person'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getPeople(start = 0, count = 10, search = ''): Observable<PersonResponse> {
    return this.http.get<PersonResponse>(this.url+`?start=${start}&count=${count}&partial_name=${search}&families=true`).pipe(
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
    this.messageService.error(`PersonService: ${message}`);
  }
}
