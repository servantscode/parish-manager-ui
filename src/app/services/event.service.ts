import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Event } from '../event';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EventService { 
  private url = 'http://localhost:84/rest/event'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getEvents(startTime:Date, endTime:Date, search = ''): Observable<Event[]> {
    return this.http.get<Event[]>(this.url+`?start_date=${startTime.toISOString()}&end_date=${endTime.toISOString()}&partial_description=${search}`).pipe(
        catchError(this.handleError('getEvents', null))
      );
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getEvent', null))
      );
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.url, event, httpOptions).pipe(
        tap(event => this.log('Created event ' + event.description)),
        catchError(this.handleError('createEvent', null))
      );
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(this.url, event, httpOptions).pipe(
        tap(event => this.log('Updated event ' + event.description)),
        catchError(this.handleError('updateEvent', null))
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
    this.messageService.error(`EventService: ${message}`);
  }
}
