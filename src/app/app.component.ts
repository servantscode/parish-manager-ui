import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { OrganizationService } from './sccommon/services/organization.service';

import { ApiLocatorService, LoginService } from 'sc-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDev: boolean = false;
  isDemo: boolean = false;

  constructor(private router: Router,
              public apiLocatorService: ApiLocatorService,
              public loginService: LoginService,
              public organizationService: OrganizationService) { 
}

  ngOnInit() {
    const href = window.location.href;

    this.isDev = href.indexOf("localhost") > -1;
    this.isDemo = href.startsWith("https://demo");

    this.apiLocatorService.setPrefixUrl(environment.serviceUrlPrefix)
    this.organizationService.setActiveOrg();
  }
}