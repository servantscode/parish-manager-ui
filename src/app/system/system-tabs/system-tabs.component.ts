import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'sc-common';

@Component({
  selector: 'app-system-tabs',
  templateUrl: './system-tabs.component.html',
  styleUrls: ['./system-tabs.component.scss']
})
export class SystemTabsComponent implements OnInit {

  public selectedTab: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService) { }

  ngOnInit() {
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'organizations';
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['system', tab]);
  }
}
