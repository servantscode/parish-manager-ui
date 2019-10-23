import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { LoginService } from 'sc-common';

import { OrganizationService } from 'sc-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDev: boolean = false;
  isDemo: boolean = false;

  constructor(private titleService: Title,
              private router: Router,
              public loginService: LoginService,
              public organizationService: OrganizationService) { 
}

  ngOnInit() {
    const href = window.location.href;

    this.isDev = href.indexOf("localhost") > -1;
    this.isDemo = href.startsWith("https://demo");

    this.organizationService.orgSub.subscribe(org => {
        this.titleService.setTitle(org.name);
      });

    this.organizationService.setActiveOrg();
  }
}