import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from '../../sccommon/services/base.service';

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
export class EnrollmentService extends BaseService {
  private url = 'http://localhost:81/rest/enrollment'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

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
}
