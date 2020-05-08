import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService, LoginService, MessageService, PaginatedService, PaginatedResponse } from 'sc-common';

import { Classroom } from 'sc-common';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService extends PaginatedService<Classroom> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/program/:programId:/section/:sectionId:/classroom"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "classroom";
  }

  public getTemplate(): Classroom {
    return new Classroom().asTemplate();
  }

    public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<Classroom>> {
    var url = this.apiService.prefaceUrl('/rest/program/:programId:');
    if(pathVars && pathVars.sectionId)
      url += `/section/:sectionId:`;
    
    return this.http.get<PaginatedResponse<Classroom>>(this.modifyUrl(url, pathVars) +`/classroom?start=${start}&count=${count}&search=${encodeURIComponent(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

}
