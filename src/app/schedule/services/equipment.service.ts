import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Equipment } from '../equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends PaginatedService<Equipment> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/equipment"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "room";
  }

  public getTemplate(): Equipment {
    return new Equipment().asTemplate();
  }
}