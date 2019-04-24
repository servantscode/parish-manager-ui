import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Family } from '../../sccommon/family';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends PaginatedService<Family> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl('/rest/family'), http, messageService);
  }

  public getPermissionType(): string {
    return "family";
  }

  public getTemplate(): Family {
    return new Family().asTemplate();
  }

  public getPage(start = 0, count = 10, search = '', includeInactive=false): Observable<PaginatedResponse<Family>> {
    return this.http.get<PaginatedResponse<Family>>(this.url+`?start=${start}&count=${count}&partial_name=${search}&include_inactive=${includeInactive}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  public attachPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/photo`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        catchError(this.handleError('attachPhoto', null))
      );
  }
}
