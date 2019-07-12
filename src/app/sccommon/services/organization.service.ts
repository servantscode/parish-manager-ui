import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService } from './api-locator.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';
import { PaginatedService } from './paginated.service';

import { Organization } from '../organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends PaginatedService<Organization> {

  private activeOrganization: Organization;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/organization"), http, messageService, loginService);
  }

  public setActiveOrg() {
    this.http.get<Organization>(this.url+"/active").pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('get', null))
      ).subscribe(org => this.activeOrganization = org);
  }

  public activeOrg(): Organization {
    return this.activeOrganization;
  }

  public activeOrgName(): string { 
    return this.activeOrganization? this.activeOrganization.name: "Servant's Code";
  }

  public getPermissionType(): string {
    return "system.organization";
  }

  public getTemplate(): Organization {
    return new Organization().asTemplate();
  }

  public attachPhoto(id: number, photoGuid: string) {
    return this.http.put(this.url + `/${id}/photo`, photoGuid, {headers: {"Content-Type": "text/plain"}}).pipe(
        catchError(this.handleError('attachPhoto', null))
      );
  }

}
