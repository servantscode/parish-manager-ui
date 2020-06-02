import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {  

  private environment;

  constructor(@Inject('environment') environment) {
    this.environment = environment;
  }

  prefaceUrl(path: string): string {
    return this.environment.apiUrl + path;
  }
}
