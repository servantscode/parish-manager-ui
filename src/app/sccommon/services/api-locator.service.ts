import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiLocatorService {

  private static DEV_URLS = {
    photo: 'http://localhost/rest/photo',
    login: 'http://localhost/rest/login',
    credentials: 'http://localhost/rest/credentials',
    permission: 'http://localhost/rest/permission',    
    role: 'http://localhost/rest/role',
    donation: 'http://localhost/rest/donation',
    pledge: 'http://localhost/rest/pledge',
    metrics: 'http://localhost/rest/metrics',
    ministry: 'http://localhost/rest/ministry',
    enrollment: 'http://localhost/rest/enrollment',
    person: 'http://localhost/rest/person',
    family: 'http://localhost/rest/family',
    availability: 'http://localhost/rest/reservation/availability',
    equipment: 'http://localhost/rest/equipment',
    event: 'http://localhost/rest/event',
    room: 'http://localhost/rest/room'
  };

  private static PRODUCTION_URLS = {
   photo: '/rest/photo',
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
  
  // private urls = ApiLocatorService.DEV_URLS;
  private urls = ApiLocatorService.PRODUCTION_URLS;


  constructor() { 
    // if(devMode)
    //   this.urls = ApiLocatorService.DEV_URLS;
  }

  getServiceUrl(service: string): string {
    return this.urls[service];
  }
}
