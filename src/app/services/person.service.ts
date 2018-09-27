import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Person } from '../person';
import { PEOPLE } from '../mock-people';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private url = 'http://localhost/rest/person'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getPeople(): Observable<Person[]> {
    this.log('Retrieving people');
    return this.http.get<Person[]>(this.url).pipe(
        tap(people => this.log('Got the people')),
        catchError(this.handleError('getPeople', []))
      );
  }

  getPerson(id: number): Observable<Person> {
    this.messageService.add(`PersonService: retrieving person id=${id}`);
    return this.http.get<Person>(this.url + `/${id}`).pipe(
        tap(person => this.log('Found person' + person.id)),
        catchError(this.handleError('getPerson', null))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`PersonService: ${message}`);
  }
}
