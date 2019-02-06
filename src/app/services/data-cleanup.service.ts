import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataCleanupService {

  public prune<T>(item: any, template: T): T {
    for(let key of Object.keys(template))
      template[key] = item[key];
    return template;
  }
}
