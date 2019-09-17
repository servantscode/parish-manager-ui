import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'sc-common';

@Component({
  selector: 'app-program-tabs',
  templateUrl: './program-tabs.component.html',
  styleUrls: ['./program-tabs.component.scss']
})
export class ProgramTabsComponent implements OnInit {
  public selectedTab: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService) { }

  ngOnInit() {
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'sections';
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['formation', this.getId(), tab]);
  }

  public getId(): number {
    return +this.route.snapshot.paramMap.get('id');    
  }
}
