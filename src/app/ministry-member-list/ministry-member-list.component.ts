import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, switchMap, startWith, debounceTime } from 'rxjs/operators'

import { Router } from '@angular/router';
import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../services/enrollment.service';
import { Person } from '../person'
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-ministry-member-list',
  templateUrl: './ministry-member-list.component.html',
  styleUrls: ['./ministry-member-list.component.scss']
})
export class MinistryMemberListComponent implements OnInit {

  @Input() enrollments: Enrollment[];
  @Input() ministryId: number;

  newMember = false;

  filteredPersons: Observable<Person[]>;

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
              private personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredPersons = this.enrollmentForm.get('personName').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.personService.getPeople(0, 10, value)
          .pipe(
              map(personResp => personResp.results),
            ))
      );
  }

  highlightPerson(enrollment: Enrollment) {
    this.highlightedEnrollment = enrollment;
  }

  viewPerson(id: number): void {
    if(id > 0) {
      this.router.navigate(['person', 'detail', id]);
    }
  }

  newMembership(): void {
    this.newMember = true;
  }

  selectPerson(event: any): void {
    var selected = event.option.value;
    this.enrollmentForm.get('personName').setValue(selected.name);
    this.enrollmentForm.get('personId').setValue(selected.id);
    this.enrollmentForm.get('ministryId').setValue(this.ministryId);
  }

  addMember() {
    this.enrollmentService.createEnrollment(this.enrollmentForm.value).
        subscribe(() => {
          this.newMember = false;
          this.enrollmentForm.reset();
        });
  }

  selectName(person?: Person): string | undefined {
    return person ? typeof person === 'string' ? person : person.name : undefined;
  }
}
