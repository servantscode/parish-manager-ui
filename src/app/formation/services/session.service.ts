import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService } from 'sc-common';
import { Session } from 'sc-common';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends PaginatedService<Session> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/section/:sectionId:/session"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "session";
  }

  public getTemplate(): Session {
    return new Session().asTemplate();
  }

  link(programId: number, recurrenceId: number): Observable<any> {
    const data = {"programId": programId, "recurrenceId": recurrenceId};
    return this.http.post<any>(this.modifyUrl(this.url, {"programId": programId}), data, this.httpOptions).pipe(
        tap(item => this.log('Sessions linked!')),
        catchError(this.handleError('linkSessions', null))
      );
  }

  create(item: Session, pathVars?: any): Observable<Session> {
    alert("Not implemented!");
    return null;
  }

  update(item: Session, pathVars?: any): Observable<Session> {
    alert("Not implemented!");
    return null;
  }
}