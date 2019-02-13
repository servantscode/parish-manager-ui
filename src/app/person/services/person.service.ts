import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Person } from '../person';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PersonService extends PaginatedService<Person> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super('http://localhost/rest/person', http, messageService);
  }

  public getPermissionType(): string {
    return "person";
  }

  public getTemplate(): Person {
    return new Person().asTemplate();
  }

  public attachPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/photo`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        tap(item => this.log('Photo Attached!')),
        catchError(this.handleError('attachPhoto', null))
      );
  }
}
