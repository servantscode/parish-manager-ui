import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Person } from '../person';
import { Family } from '../family';
import { PersonService } from '../services/person.service';
import { FamilyService } from '../services/family.service';

import { StateSelectorComponent } from '../state-selector/state-selector.component';

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

  @Input() person: Person;
  private highlightedPerson: Person;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private personService: PersonService,
              private familyService: FamilyService,
              private location: Location) { }

  ngOnInit() {
    this.getPerson();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.ENTER) {
      this.save();
    }

    if (event.keyCode === KEY_CODE.ESCAPE) {
      this.goBack();
    }
  }

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
        });
    } else if (familyId > 0) {
      this.familyService.getFamily(familyId).
        subscribe(family => {
          this.person.family = family;
        });
    }
  }

  updatePerson(id: number): void {
    if(id > 0) {
      this.personService.getPerson(id).
        subscribe(person => {
          if(person.family == null) {
            person.family = new Family();
          }
          this.person = person;
        });
      this.router.navigate(['person', 'detail', id]);
    } else {
      this.router.navigate(['person', 'detail'], {queryParams: {familyId: this.person.family.id}});
    }
  }

  guessSurname() {
    if(this.person.family.id == undefined) {
      var bits = this.person.name.trim().split(" ");
      if(bits.length > 1) {
        this.person.family.surname = bits.pop();
      } else {
        this.person.family.surname = '';
      }
    }
  }

  updateState(newState: string) {
    this.person.family.address.state = newState;
  }


  highlightPerson(person: Person) {
    this.highlightedPerson = person;
  }

  goBack(): void {
    this.router.navigate(['person']);
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.updatePerson(this.person).
        subscribe(person => {
          this.person = person;
          this.goBack();
        });
    } else {
      this.personService.createPerson(this.person).
        subscribe(person => {
          this.person = person;
          this.goBack();
        });      
    }
  }
}
