import { Injectable, Inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {  

  constructor(private configurationService: ConfigurationService) {}

  prefaceUrl(path: string): string {
    const settings = this.configurationService.settings;
    if(!settings)
      console.error("No configuration settings available!");
    
    return settings.serviceUrlPrefix + path;
  }
}
