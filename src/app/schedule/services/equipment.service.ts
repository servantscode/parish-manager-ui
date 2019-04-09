import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Equipment } from '../equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends PaginatedService<Equipment> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.prefaceUrl("/rest/equipment"), http, messageService);
  }

  public getPermissionType(): string {
    return "room";
  }

  public getTemplate(): Equipment {
    return new Equipment().asTemplate();
  }
}