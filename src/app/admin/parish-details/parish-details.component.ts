import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../sccommon/services/login.service';
import { OrganizationService } from '../../sccommon/services/organization.service';

import { Organization } from '../../sccommon/organization';

@Component({
  selector: 'app-parish-details',
  templateUrl: './parish-details.component.html',
  styleUrls: ['./parish-details.component.scss']
})
export class ParishDetailsComponent implements OnInit {

  parish: Organization;

  constructor(public loginService: LoginService,
              private organizationService: OrganizationService) { }

  ngOnInit() {
    this.parish = this.organizationService.activeOrg();
  }

  attachPhoto(guid: any): void {
    this.organizationService.attachPhoto(this.parish.id, guid)
    .subscribe(() => {
      this.parish.photoGuid = guid
    });
  }
}
