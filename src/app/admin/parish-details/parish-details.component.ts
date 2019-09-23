import { Component, OnInit } from '@angular/core';

import { LoginService } from 'sc-common';
import { OrganizationService } from 'sc-common';
import { DepartmentService } from '../../sccommon/services/department.service';
import { CategoryService } from '../../sccommon/services/category.service';

import { Organization } from 'sc-common';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';

@Component({
  selector: 'app-parish-details',
  templateUrl: './parish-details.component.html',
  styleUrls: ['./parish-details.component.scss']
})
export class ParishDetailsComponent implements OnInit {

  parish: Organization;
  CategoryDialogComponent = CategoryDialogComponent;
  DepartmentDialogComponent = DepartmentDialogComponent;

  constructor(public loginService: LoginService,
              public categoryService: CategoryService,
              public departmentService: DepartmentService,
              private organizationService: OrganizationService) { 
      this.parish = this.organizationService.activeOrg();
  }

  ngOnInit() {
  }

  attachPhoto(guid: any): void {
    this.organizationService.attachPhoto(this.parish.id, guid)
    .subscribe(() => {
      this.parish.photoGuid = guid
    });
  }
}
