import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

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