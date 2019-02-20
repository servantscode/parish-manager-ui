import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { BaseService } from '../../sccommon/services/base.service';
import { MessageService } from '../../sccommon/services/message.service';

import { Permission } from '../permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(http, messageService);
    this.url = apiService.getServiceUrl("permission");
  }

  getAvailablePermissions(): Observable<Permission[]> {
    return this.http.get<Object>(this.url).pipe(
        map(resp => { return this.parsePermissions(resp, "")}),
        catchError(this.handleError('getAvailablePermissions', null))
      );
  }

  collectPermissions(permissions: Permission[]): string[] {
    var results = [];
    permissions.forEach(child => this.findSetPermissions(child, "", results));
    return results;
  }

  // ----- Private ----
  private parsePermissions(obj: Object, parent: string): Permission[] {
    return Object.keys(obj).reduce<Permission[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Permission();
      node.name = key;
      node.canonicalName = (parent.length > 0 ? parent + ".": "") + key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.parsePermissions(value, node.canonicalName);
          node.canonicalName += ".*";
          node.active = (node.children.filter(child => !child.active).length == 0);
        } else {
          node.active = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  private findSetPermissions(perm: Permission, parent: string, collector: string[]) {
    if(perm.active) {
      collector.push(perm.canonicalName);
    } else if(perm.children != null) {
      perm.children.forEach(child =>
          this.findSetPermissions(child, (parent? parent + ".": "") + perm.name, collector)
        );
    }
  }
}
