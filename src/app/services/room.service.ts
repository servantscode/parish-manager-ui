import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from './message.service';
import { PaginatedService } from './paginated.service';

import { Room } from '../room';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends PaginatedService<Room> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super('http://localhost:84/rest/room', http, messageService);
  }

  getRoomTypes(): Observable<string[]> {
    return this.http.get(this.url + '/types').pipe(
        catchError(this.handleError('getRoomTypes', null))
      );
  }
}