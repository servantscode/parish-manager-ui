import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Family } from '../family';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends PaginatedService<Family> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super('http://localhost/rest/family', http, messageService);
  }

  public getPermissionType(): string {
    return "family";
  }

  public getTemplate(): Family {
    return new Family().asTemplate();
  }
}
