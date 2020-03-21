import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Program } from '../formation';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends PaginatedService<Program> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program"), http, messageService, loginService);
  }

  public getAttendanceSheets(programId: number): Observable<any> {
    return this.http.get(this.url + `/${programId}/attendanceSheets`, PaginatedService.pdfOptions).pipe(
        catchError(this.handleError('attendanceSheets', null))
      );
  }

  public getPermissionType(): string {
    return "program";
  }

  public getTemplate(): Program {
    return new Program().asTemplate();
  }
}