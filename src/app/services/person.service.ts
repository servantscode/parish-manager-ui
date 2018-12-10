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
        map(this.parseDates),
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

  // Such HACK!! Much sorrow... 
  // Parsing a date without a time causes JavaScript to automatically drop hours due to timezone processing.
  // This hack ensures the date is actually preserved and not rolled back {timezone} hours.
  // If someone every figures out how to process dates w/o times that respects timezone, 
  // tell Greg that you fixed this and relieve him of his grief.
  private parseDates(person: Person) {
    const birthdate = person.birthdate;
    if(birthdate !== null) {
      const d = new Date(birthdate);
      person.birthdate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    const memberSince = person.memberSince;
    if(memberSince !== null) {
      const d = new Date(memberSince);
      person.memberSince = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    return person;
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
