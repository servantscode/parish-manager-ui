import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
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
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/room"), http, messageService, loginService);
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