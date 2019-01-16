import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { BaseService } from './base.service';

import { Room } from '../room';
import { PaginatedResponse } from '../paginated.response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoomService extends BaseService {
  private url = 'http://localhost:84/schedule/room'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getMinistries(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Room>> {
    return this.http.get<PaginatedResponse<Room>>(this.url+`?start=${start}&count=${count}&partial_name=${search}`).pipe(
        catchError(this.handleError('getRooms', null))
      );
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(this.url + `/${id}`).pipe(
        catchError(this.handleError('getRoom', null))
      );
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.url, room, httpOptions).pipe(
        tap(room => this.log('Created room ' + room.name)),
        catchError(this.handleError('createRoom', null))
      );
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(this.url, room, httpOptions).pipe(
        tap(room => this.log('Updated room ' + room.name)),
        catchError(this.handleError('updateRoom', null))
      );
  }
}