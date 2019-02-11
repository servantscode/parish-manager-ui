import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends PaginatedService<Role> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super('http://localhost:8080/rest/role', http, messageService);
  }

  public getPermissionType(): string {
    return "admin.role";
  }

  public getRoleNames(): Observable<string[]> {
    return this.http.get<string[]>(this.url + '/autocomplete', this.httpOptions)
      .pipe(
        catchError(this.handleError('get roles', null))
      );
  }
}