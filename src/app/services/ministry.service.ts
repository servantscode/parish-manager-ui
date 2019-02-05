import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MessageService } from './message.service';
import { PaginatedService } from './paginated.service';

import { Ministry } from '../ministry';

@Injectable({
  providedIn: 'root'
})
export class MinistryService extends PaginatedService<Ministry> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super('http://localhost:81/rest/ministry', http, messageService);
  }

  public getType(): string {
    return "ministry";
  }
}
