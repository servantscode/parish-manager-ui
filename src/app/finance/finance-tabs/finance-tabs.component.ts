import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'sc-common';

@Component({
  selector: 'app-finance-tabs',
  templateUrl: './finance-tabs.component.html',
  styleUrls: ['./finance-tabs.component.scss']
})
export class FinanceTabsComponent implements OnInit {
  public selectedTab: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService) { }

  ngOnInit() {
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'overview';
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['finance', tab]);
  }

  public getId(): number {
    return +this.route.snapshot.paramMap.get('id');    
  }
}
