import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {  
  constructor() {}

  prefixUrl: string = 'http://localhost';

  setPrefixUrl(prefix: string) {
    this.prefixUrl = prefix;
  }

  prefaceUrl(path: string): string {
    return this.prefixUrl + path;
  }
}
