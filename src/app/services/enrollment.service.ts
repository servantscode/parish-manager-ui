import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Enrollment } from '../enrollment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private url = 'http://localhost:81/rest/enrollment'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getEnrollmentsForPerson(personId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.url + "/person/" + personId).pipe(
        catchError(this.handleError('getEnrollmentsForPerson', null))
      );
  }

  getEnrollmentsForMinistry(ministryId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.url + "/ministry/" + ministryId).pipe(
        catchError(this.handleError('getEnrollmentsForMinistry', null))
      );
  }

  createEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.url, enrollment, httpOptions).pipe(
        tap(enrollment => this.log('Created enrollment for ' + enrollment.personName)),
        catchError(this.handleError('createEnrollment', null))
      );
  }

  updateEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(this.url, enrollment, httpOptions).pipe(
        tap(enrollment => this.log('Updated enrollment ' + enrollment.personName)),
        catchError(this.handleError('updateEnrollment', null))
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
    this.messageService.error(`EnrollmentService: ${message}`);
  }
}
