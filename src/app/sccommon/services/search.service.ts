import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { PaginatedResponse } from 'sc-common';

import { SavedSearch } from '../saved-search';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends PaginatedService<SavedSearch> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/search'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "search";
  }

  public getTemplate(): SavedSearch {
    return new SavedSearch().asTemplate();
  }

  public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<SavedSearch>> {
    var url = this.url;
    if(pathVars && pathVars.type)
      url += `/type/${pathVars.type}`;
    
    return this.http.get<PaginatedResponse<SavedSearch>>(url+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

}
