import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { Ministry } from '../ministry';

@Injectable({
  providedIn: 'root'
})
export class MinistryService extends PaginatedService<Ministry> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(apiService.getServiceUrl("ministry"), http, messageService);
  }

  public getPermissionType(): string {
    return "ministry";
  }

  public getTemplate(): Ministry {
    return new Ministry().asTemplate();
  }
}
