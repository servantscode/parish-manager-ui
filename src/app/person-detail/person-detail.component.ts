import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Person } from '../person';
import { PersonService } from '../services/person.service';

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

  constructor(private route: ActivatedRoute,
              private personService: PersonService,
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
    if(id > 0) {
      this.personService.getPerson(id).
        subscribe(person => this.person = person);
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.updatePerson(this.person).
        subscribe(person => {
          this.person = person;
          this.location.back();
        });
    } else {
      this.personService.createPerson(this.person).
        subscribe(person => {
          this.person = person;
          this.location.back();
        });      
    }
  }
}
