import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'sc-common';
import { PersonService } from 'sc-common';

@Component({
  selector: 'app-person-tabs',
  templateUrl: './person-tabs.component.html',
  styleUrls: ['./person-tabs.component.scss']
})
export class PersonTabsComponent implements OnInit {
  public selectedTab: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,
              public personService: PersonService) { }

  ngOnInit() {
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'detail';
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['person', this.getId(), tab]);
  }

  public getId(): number {
    return +this.route.snapshot.paramMap.get('id');    
  }
}
