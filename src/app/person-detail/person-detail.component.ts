import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { Person } from '../person';
import { Family } from '../family';
import { PersonService } from '../services/person.service';
import { FamilyService } from '../services/family.service';
import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../services/enrollment.service';
import { SCValidation } from '../validation';

import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component'

export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27
}

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit {
  private person: Person;
  private enrollments: Enrollment[];

  personForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', Validators.email],
      phoneNumber: ['', [Validators.minLength(8), Validators.maxLength(14), SCValidation.validatePhone()]],
      headOfHousehold: [''],
      family: this.fb.group({
        id: [''],
        surname: ['', Validators.required],
        address: this.fb.group({
          street1: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), SCValidation.actualState()]],
          zip: ['', [Validators.required, Validators.min(0), Validators.max(99999), SCValidation.numeric()]]
        })
      })
    });
  
  filteredOptions: Observable<string[]>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private personService: PersonService,
              private familyService: FamilyService,
              private enrollmentService: EnrollmentService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getPerson();

    this.route.params.subscribe(
        params => {
            this.getPerson();
        }
    );

    this.filteredOptions = this.personForm.get('family.address.state').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

//Disabled until I can capture events from autocomplete without taking form action as well...
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {    
  //   if (event.keyCode === KEY_CODE.ENTER) {
  //     this.save();
  //   }

  //   if (event.keyCode === KEY_CODE.ESCAPE) {
  //     this.goBack();
  //   }
  // }

  getPerson(): void {
    this.person = new Person();
    const id = +this.route.snapshot.paramMap.get('id');
    const familyId = +this.route.snapshot.queryParamMap.get('familyId');

    if(id > 0) {
      this.personService.getPerson(id).
        subscribe(person => {
          if(person.family == null) {
            person.family = new Family();
          }
          this.person = person;
          this.personForm.patchValue(person);
          this.enrollmentService.getEnrollmentsForPerson(person.id).
            subscribe(enrollments => {
              this.enrollments = enrollments;
            });
        });
    } else if (familyId > 0) {
      this.familyService.getFamily(familyId).
        subscribe(family => {
          this.person.family = family;
          this.personForm.patchValue(this.person);
        });
    }
  }

  guessSurname() {
    const input = this.personForm.get("name").value;
    if(this.person.family.id == undefined) {
      var bits = input.trim().split(" ");
      if(bits.length > 1) {
        this.personForm.get("family.surname").setValue(bits.pop());
      } else {
        this.personForm.get("family.surname").setValue('');
      }
    }
  }

  goBack(): void {
    this.router.navigate(['people']);
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.updatePerson(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.router.navigate(['person', 'detail', person.id]);
        });
    } else {
      this.personService.createPerson(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.router.navigate(['person', 'detail', person.id]);
        });      
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return SCValidation.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  formatPhoneNumber(): void {
    const phoneField = this.personForm.get("phoneNumber");
    phoneField.setValue(SCValidation.formatPhone(phoneField.value));
  }
}
