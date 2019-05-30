import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Room } from '../room';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends PaginatedService<Room> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected router: Router) { 
    super(apiService.prefaceUrl("/rest/room"), http, messageService, router);
  }

  public getPermissionType(): string {
    return "room";
  }

  public getTemplate(): Room {
    return new Room().asTemplate();
  }

  getRoomTypes(): Observable<string[]> {
    return this.http.get(this.url + '/types').pipe(
        catchError(this.handleError('getRoomTypes', null))
      );
  }
}