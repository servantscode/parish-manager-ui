import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';
import { PaginatedResponse } from 'sc-common';

import { Note } from '../note';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends PaginatedService<Note> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/note'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "note";
  }

  public getTemplate(): Note {
    return new Note().asTemplate();
  }

  // Just until everything says search
  public getPage(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Note>> {
    return this.http.get<PaginatedResponse<Note>>(this.url+`?start=${start}&count=${count}&search=${encodeURIComponent(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

}
