import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Note } from '../note';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends PaginatedService<Note> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected router: Router) { 
    super(apiService.prefaceUrl('/rest/note'), http, messageService, router);
  }

  public getPermissionType(): string {
    return "note";
  }

  public getTemplate(): Note {
    return new Note().asTemplate();
  }

  // Just until everything says search
  public getPage(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Note>> {
    return this.http.get<PaginatedResponse<Note>>(this.url+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

}
