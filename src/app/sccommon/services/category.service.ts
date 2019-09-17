import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

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
