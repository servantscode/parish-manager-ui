import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {

  private static SERVICE_PATHS = {
    login: '/rest/login',
    credentials: '/rest/credentials',
    permission: '/rest/permission',    
    role: '/rest/role',
    donation: '/rest/donation',
    pledge: '/rest/pledge',
    metrics: '/rest/metrics',
    ministry: '/rest/ministry',
    enrollment: '/rest/enrollment',
    person: '/rest/person',
    family: '/rest/family',
    availability: '/rest/reservation/availability',
    equipment: '/rest/equipment',
    event: '/rest/event',
    room: '/rest/room'
  };
  
  constructor() {}

  getServiceUrl(service: string): string {
    return environment.serviceUrlPrefix + ApiLocatorService.SERVICE_PATHS[service];
  }

  prefaceUrl(path: string): string {
    return environment.serviceUrlPrefix + path;
  }
}
