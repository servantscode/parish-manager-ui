import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-tabs',
  templateUrl: './admin-tabs.component.html',
  styleUrls: ['./admin-tabs.component.scss']
})
export class AdminTabsComponent implements OnInit {

  public selectedTab: string;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    var tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = tab? tab.toLowerCase(): 'roles';
  }

  public selectTab(tab: any): void {
    this.selectedTab = tab;
    this.router.navigate(['admin', tab]);
  }
}
