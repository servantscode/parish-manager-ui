import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Organization } from '../organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends PaginatedService<Organization> {

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
      ).subscribe(org => {
          localStorage.setItem("activeOrg", JSON.stringify(org));
        });
  }

  public clearActiveOrg() {
    localStorage.removeItem("activeOrg");
  }

  public activeOrg(): Organization {
    const orgJson = localStorage.getItem("activeOrg");
    return orgJson? this.mapObject(JSON.parse(orgJson)): null;
  }

  public activeOrgName(): string { 
    const activeOrg = this.activeOrg();
    return activeOrg? activeOrg.name: "Servant's Code";
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
