import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Baptism } from '../sacrament';

@Injectable({
  providedIn: 'root'
})
export class BaptismService extends PaginatedService<Baptism> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl("/rest/sacrament/baptism"), http, messageService);
  }

  public getPermissionType(): string {
    return "baptism";
  }

  public getTemplate(): Baptism {
    return new Baptism().asTemplate();
  }

  getByPerson(personId: number): Observable<Baptism> {
    return this.http.get<Baptism>(this.url + `/person/${personId}`).pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('getByPerson', null))
      );
  }
}