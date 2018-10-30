import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { Person } from '../person';
import { Family } from '../family';
import { PersonService } from '../services/person.service';
import { FamilyService } from '../services/family.service';

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
  private static STATES: string[] = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS",
                                     "KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP",
                                     "OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"];

  private person: Person;

  personForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    email: [''],
    phoneNumber: [''],
    headOfHousehold: [''],
    family: this.fb.group({
        id: '',
        surname: ['', Validators.required],
        address: this.fb.group({
          street1: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)])],
          zip: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])]
        })
      })
    });
  
  filteredOptions: Observable<string[]>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private personService: PersonService,
              private familyService: FamilyService,
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
    this.router.navigate(['person']);
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.updatePerson(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.goBack();
        });
    } else {
      this.personService.createPerson(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.goBack();
        });      
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return PersonDetailComponent.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }
}
