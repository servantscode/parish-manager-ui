import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from '../../sccommon/services/base.service';

import { Relationship } from '../relationship';
@Injectable({
  providedIn: 'root'
})
export class RelationshipService extends BaseService {
 private url: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, router);
    this.url = apiService.prefaceUrl("/rest/relationship");
  }

  public getRelationships(id: number): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(this.url+`/${id}`).pipe(
        catchError(this.handleError('getRelationships', null))
      );
  }

  public updateRelationships(relationships: Relationship[]) {
    return this.http.put(this.url, relationships, this.httpOptions).pipe(
        catchError(this.handleError('updateRelationships', null))
      );
  }
}
