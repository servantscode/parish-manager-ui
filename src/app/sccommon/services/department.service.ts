import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Department } from '../department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends PaginatedService<Department> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl('/rest/department'), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "admin.department";
  }

  public getTemplate(): Department {
    return new Department().asTemplate();
  }
}
