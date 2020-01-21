import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { BaseService } from 'sc-common';

import { AttendanceReport, SessionAttendance } from '../attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl("/rest/program/:programId:/section/:sectionId:/attendance");
  }

  getAttendance(programId: number, sectionId: number): Observable<AttendanceReport> {
    return this.http.get<AttendanceReport>(this.modifyUrl(this.url, {"programId": programId, "sectionId": sectionId})).pipe(
        catchError(this.handleError('getSectionAttendance', null))
      );
  }

  saveSessionAttendance(attendance: SessionAttendance): Observable<AttendanceReport> {
    const url = this.modifyUrl(this.url, {"programId": attendance.programId, "sectionId": attendance.sectionId});
    return this.http.put<AttendanceReport>(url, attendance, this.httpOptions).pipe(
        catchError(this.handleError('saveSessionAttendance', null))
      );
  }
}
