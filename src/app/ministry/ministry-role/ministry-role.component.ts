import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'sc-common';

import { MinistryService } from '../services/ministry.service';
import { MinistryRoleService } from '../services/ministry-role.service';

import { MinistryRoleDialogComponent } from '../ministry-role-dialog/ministry-role-dialog.component';

import { Ministry } from '../ministry';


@Component({
  selector: 'app-ministry-role',
  templateUrl: './ministry-role.component.html',
  styleUrls: ['./ministry-role.component.scss']
})
export class MinistryRoleComponent implements OnInit {
  public ministryId: number;
  private ministry: Ministry;

  MinistryRoleDialogComponent = MinistryRoleDialogComponent;

  constructor(public ministryRoleService: MinistryRoleService,
              public ministryService: MinistryService,
              public loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) { 
  }

  ngOnInit() {
    this.route.params.subscribe(
        params => {
          this.ministryId = +this.route.snapshot.paramMap.get('id');
          this.getMinistry();
        });
  }

  getMinistry(): void {
    if(this.ministryId <= 0 || !this.loginService.userCan('ministry.read'))
      this.router.navigate(['not-found']);

    this.ministryService.get(this.ministryId).
      subscribe(ministry => {
        if(ministry)
          this.ministry = ministry;
      });


  }

  goBack() {
    this.location.back();
  }
}
