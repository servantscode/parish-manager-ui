import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';

import { MassAvailability } from '../mass-availability';

@Injectable({
  providedIn: 'root'
})
export class MassAvailabilityService extends PaginatedService<MassAvailability> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected router: Router) { 
    super(apiService.prefaceUrl("/rest/sacrament/mass/availability"), http, messageService, router);
  }

  public getPermissionType(): string {
    return "sacrament.mass.intention";
  }

  public getTemplate(): MassAvailability {
    return new MassAvailability().asTemplate();
  }

  get(id: number, pathVars?: any): Observable<MassAvailability> {
    const url = this.apiService.prefaceUrl("/rest/sacrament/mass");
    return this.http.get<MassAvailability>(this.modifyUrl(url, pathVars) + `/${id}/time`).pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('get', null))
      );
  }

  create(item: MassAvailability, pathVars?: any): Observable<MassAvailability> {
    alert("Not implemented!!");
    return null;
  }

  update(item: MassAvailability, pathVars?: any): Observable<MassAvailability> {
    alert("Not implemented!!");
    return null;
  }

  delete(item: MassAvailability, deletePermenantly: boolean = false, pathVars?: any): Observable<void> {
    alert("Not implemented!!");
    return null;
  }
}