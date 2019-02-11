import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, filter, switchMap, startWith, debounceTime } from 'rxjs/operators'

import { LoginService } from '../../sccommon/services/login.service';

import { Person } from '../../person/person';
import { PersonService } from '../../person/services/person.service';

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

  filteredPersons: Observable<Person[]>;
  filteredMinistries: Observable<Ministry[]>;

  enrollmentForm = this.fb.group({
      personId: ['', Validators.required],
      personName: [''],
      ministryId: ['', Validators.required],
      ministryName: '',
      role: ['', Validators.required]
    });

  private highlightedEnrollment: Enrollment;

  constructor(private router: Router,
              private enrollmentService: EnrollmentService,
              private loginService: LoginService,
              private personService: PersonService,
              private ministryService: MinistryService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredPersons = this.enrollmentForm.get('personName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.personService.getPage(0, 10, value)
          .pipe(
              map(resp => resp.results
                .filter(person => !this.enrollments.find(enrollment => enrollment.personId == person.id)))              
            ))
      );

    this.filteredMinistries = this.enrollmentForm.get('ministryName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.ministryService.getPage(0, 10, value)
          .pipe(
              map(resp => resp.results
                .filter(ministry => !this.enrollments.find(enrollment => enrollment.ministryId == ministry.id)))              
            ))
      );
  }

  ngOnChanges() {
    if(this.ministryId !== 0 && this.ministryId !== undefined) {
      this.enrollmentService.getEnrollmentsForMinistry(this.ministryId).
        subscribe(enrollments => {
          this.enrollments = enrollments;
        });
    }

    if(this.personId !== 0 && this.personId !== undefined) {
      this.enrollmentService.getEnrollmentsForPerson(this.personId).
        subscribe(enrollments => {
          this.enrollments = enrollments;
        });
    }
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

  newMembership(): void {
    if(!this.loginService.userCan('ministry.enrollment.create')) 
      return;

    this.newEnrollment = true;
    this.enrollmentForm.get('ministryId').setValue(this.ministryId);
    this.enrollmentForm.get('personId').setValue(this.personId);
  }

  selectPerson(event: any): void {
    var selected = event.option.value;
    this.enrollmentForm.get('personName').setValue(selected.name);
    this.enrollmentForm.get('personId').setValue(selected.id);
  }

  selectMinistry(event: any): void {
    var selected = event.option.value;
    this.enrollmentForm.get('ministryName').setValue(selected.name);
    this.enrollmentForm.get('ministryId').setValue(selected.id);
  }

  addMembership() {
    if(!this.loginService.userCan('ministry.enrollment.create')) 
      return;

    this.enrollmentService.createEnrollment(this.enrollmentForm.value).
        subscribe(() => {
          this.enrollments.push(this.enrollmentForm.value);
          this.clearEnrollmentForm();
        });
  }

  clearEnrollmentForm() {
    this.newEnrollment = false;
    this.enrollmentForm.reset();
  }

  selectName(person?: Person): string | undefined {
    return person ? typeof person === 'string' ? person : person.name : undefined;
  }

  selectMinistryName(ministry?: Ministry): string | undefined {
    return ministry ? typeof ministry === 'string' ? ministry : ministry.name : undefined;
  }

}
