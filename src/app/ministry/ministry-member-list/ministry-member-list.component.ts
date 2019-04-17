import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, filter, switchMap, startWith, debounceTime } from 'rxjs/operators'

import { LoginService } from '../../sccommon/services/login.service';
import { PersonService } from '../../sccommon/services/person.service';

import { Person } from '../../sccommon/person';

import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../services/enrollment.service';
import { Ministry } from '../ministry';
import { MinistryService } from '../services/ministry.service';


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

  enrollmentForm = this.fb.group({
      personId: ['', Validators.required],
      ministryId: ['', Validators.required],
      role: ['', Validators.required]
    });

  private highlightedEnrollment: Enrollment;

  constructor(private router: Router,
              private enrollmentService: EnrollmentService,
              public loginService: LoginService,
              private personService: PersonService,
              private ministryService: MinistryService,
              private fb: FormBuilder) { }

  ngOnInit() { }

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
      this.router.navigate(['person', 'detail', id]);
    }
  }

  viewMinistry(id: number): void {
    if(id>0 && this.loginService.userCan('ministry.read')) {
      this.router.navigate(['ministry', 'detail', id]);
    }
  }

  showMembershipForm(): void {
    this.newEnrollment = true;
    this.enrollmentForm.get('ministryId').setValue(this.ministryId);
    this.enrollmentForm.get('personId').setValue(this.personId);
  }

  addMembership() {
    if(!this.loginService.userCan('ministry.enrollment.create')) 
      return;

    this.enrollmentService.createEnrollment(this.enrollmentForm.value).
        subscribe(() => {
          this.loadEnrollments();
          this.clearEnrollmentForm();
        });
  }

  clearEnrollmentForm() {
    this.newEnrollment = false;
    this.enrollmentForm.reset();
  }
}
