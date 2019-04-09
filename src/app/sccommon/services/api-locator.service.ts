import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {  
  constructor() {}

  prefaceUrl(path: string): string {
    return environment.serviceUrlPrefix + path;
  }
}
