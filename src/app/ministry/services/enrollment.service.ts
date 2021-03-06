import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { BaseService } from 'sc-common';

import { Enrollment } from '../enrollment';


@Injectable({
  providedIn: 'root'
})
export class EnrollmentService extends BaseService {
  private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl("/rest/enrollment");
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
    return this.http.post<Enrollment>(this.url, enrollment, this.httpOptions).pipe(
        tap(enrollment => this.log('Created enrollment for ' + enrollment.personName)),
        catchError(this.handleError('createEnrollment', null))
      );
  }

  updateEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(this.url, enrollment, this.httpOptions).pipe(
        tap(enrollment => this.log('Updated enrollment ' + enrollment.personName)),
        catchError(this.handleError('updateEnrollment', null))
      );
  }

  deleteEnrollment(enrollment: Enrollment): Observable<void> {
    return this.http.delete<void>(this.url + `/ministry/${enrollment.ministryId}/person/${enrollment.personId}`).pipe(
        tap(() => this.log('Deleted enrollment ' + enrollment.personName)),
        catchError(this.handleError('deleteEnrollment', null)));
      }
}
