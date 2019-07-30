import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from './paginated.service';

import { Category } from '../category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends PaginatedService<Category> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/category'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.category";
  }

  public getTemplate(): Category {
    return new Category().asTemplate();
  }
}
