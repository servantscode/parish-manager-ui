import { Component, OnInit } from '@angular/core';

import { OrganizationService } from 'sc-common';

import { OrganizationDialogComponent } from '../organization-dialog/organization-dialog.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  OrganizationDialogComponent = OrganizationDialogComponent;

  constructor(public organizationService: OrganizationService) { }

  ngOnInit() {
  }

}
