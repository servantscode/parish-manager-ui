import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

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
}
