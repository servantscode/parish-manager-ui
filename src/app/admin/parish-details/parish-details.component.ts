import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginService, OrganizationService, ParishService } from 'sc-common';
import { DepartmentService } from '../../sccommon/services/department.service';
import { CategoryService } from '../../sccommon/services/category.service';

import { Organization, Parish } from 'sc-common';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';

@Component({
  selector: 'app-parish-details',
  templateUrl: './parish-details.component.html',
  styleUrls: ['./parish-details.component.scss']
})
export class ParishDetailsComponent implements OnInit {

  parish: Parish;
  organization: Organization;
  CategoryDialogComponent = CategoryDialogComponent;
  DepartmentDialogComponent = DepartmentDialogComponent;

  form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      website: [''],
      pastor: [''],
      orgId: ['', Validators.required]
    });

  constructor(private fb: FormBuilder,
              public loginService: LoginService,
              public categoryService: CategoryService,
              public departmentService: DepartmentService,
              private organizationService: OrganizationService,
              private parishService: ParishService) { 
      this.organization = this.organizationService.activeOrg();
  }

  ngOnInit() {
    this.parishService.getActiveParish().subscribe(parish => {
        this.parish = parish;
        if(parish)
          this.form.patchValue(parish);
      });
  }

  attachPhoto(guid: any): void {
    this.organizationService.attachPhoto(this.organization.id, guid)
    .subscribe(() => {
      this.organization.photoGuid = guid
    });
  }

  attachBannerPhoto(guid: any): void {
    this.parishService.attachBannerPhoto(this.parish.id, guid)
    .subscribe(() => {
      this.parish.bannerGuid = guid
    });
  }

  attachPortraitPhoto(guid: any): void {
    this.parishService.attachPortraitPhoto(this.parish.id, guid)
    .subscribe(() => {
      this.parish.portraitGuid = guid
    });
  }
}
