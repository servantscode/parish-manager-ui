import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, filter, switchMap, startWith, debounceTime } from 'rxjs/operators'

import { LoginService } from 'sc-common';
import { PersonService } from 'sc-common';

import { Person } from 'sc-common';

import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../services/enrollment.service';
import { Ministry } from '../ministry';
import { MinistryService } from '../services/ministry.service';
import { MinistryRoleService } from '../services/ministry-role.service';

import { doLater } from '../../sccommon/utils';

@Component({
  selector: 'app-ministry-member-list',
  templateUrl: './ministry-member-list.component.html',
  styleUrls: ['./ministry-member-list.component.scss']
})
export class MinistryMemberListComponent implements OnInit {

  @Input() ministryId: number;
  @Input() personId: number;
  @Input() columns: string[];

  enrollments: Enrollment[];
  newEnrollment = false;
  editingEnrollment = false;

  activeMinistryId = 0;

  enrollmentForm = this.fb.group({
      personId: ['', Validators.required],
      ministryId: ['', Validators.required],
      roleId: ['', Validators.required]
    });

  private highlightedEnrollment: Enrollment;

  constructor(private router: Router,
              private enrollmentService: EnrollmentService,
              public loginService: LoginService,
              private personService: PersonService,
              private ministryService: MinistryService,
              public ministryRoleService: MinistryRoleService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.enrollmentForm.get('ministryId').valueChanges.subscribe(id => this.activeMinistryId = id);
  }

  ngOnChanges() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    if(this.ministryId) {
      this.enrollmentService.getEnrollmentsForMinistry(this.ministryId).
        subscribe(enrollments => {
          this.enrollments = enrollments;
        });
    }

    if(this.personId) {
      this.enrollmentService.getEnrollmentsForPerson(this.personId).
        subscribe(enrollments => {
          this.enrollments = enrollments;
        });
    }
  }

  peopleFilter() {
    return function(people: Person[]) {
          return people.filter(person => !this.enrollments.find(enrollment => enrollment.personId == person.id));
      }.bind(this);
  }

 ministryFilter() {
    return function(ministries: Ministry[]) {
      return ministries.filter(ministry => !this.enrollments.find(enrollment => enrollment.ministryId == ministry.id));
      }.bind(this);
  }

  highlightEnrollment(enrollment: Enrollment) {
    this.highlightedEnrollment = enrollment;
  }

  viewPerson(id: number): void {
    if(id > 0 && this.loginService.userCan('person.read')) {
      this.router.navigate(['person', id, 'detail']);
    }
  }

  viewMinistry(id: number): void {
    if(id>0 && this.loginService.userCan('ministry.read')) {
      this.router.navigate(['ministry', 'detail', id]);
    }
  }

  edit(enrollment: Enrollment) {
    if(!this.loginService.userCan("ministry.enrollment.update"))
      return;

    this.activeMinistryId = enrollment.ministryId;
    this.enrollmentForm.patchValue(enrollment);
    this.enrollmentForm.get('personId').disable();
    this.enrollmentForm.get('ministryId').disable();
    this.enrollments = this.enrollments.filter(e => e != enrollment);
    this.editingEnrollment = true;
  }

  delete(enrollment: Enrollment) {
    if(!this.loginService.userCan("ministry.enrollment.delete"))
      return;
    
    this.enrollmentService.deleteEnrollment(enrollment).subscribe(() => this.loadEnrollments());
  }

  showMembershipForm(): void {
    this.newEnrollment = true;
    this.enrollmentForm.get('ministryId').setValue(this.ministryId);
    this.enrollmentForm.get('personId').setValue(this.personId);
  }

  addMembership() {
    if(this.newEnrollment) {
      if(!this.loginService.userCan('ministry.enrollment.create')) 
        return;

      this.enrollmentService.createEnrollment(this.enrollmentForm.value).subscribe(() => this.clearEnrollmentForm());
    } else if(this.editingEnrollment) {
      if(!this.loginService.userCan("ministry.enrollment.update"))
        return;

      this.enrollmentForm.get('personId').enable();
      this.enrollmentForm.get('ministryId').enable();
      this.enrollmentService.updateEnrollment(this.enrollmentForm.value).subscribe(() => this.clearEnrollmentForm());
    }
  }

  clearEnrollmentForm() {
    this.newEnrollment = false;
    this.editingEnrollment = false;
    this.activeMinistryId=0;

    this.enrollmentForm.get('personId').enable();
    this.enrollmentForm.get('ministryId').enable();

    this.enrollmentForm.reset();
    this.loadEnrollments()
  }
}
