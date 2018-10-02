import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Person } from '../person';
import { PersonService } from '../services/person.service';

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

  getPerson(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if(id > 0) {
      this.personService.getPerson(id).
        subscribe(person => this.person = person);
    } else {
      this.person = new Person();
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.updatePerson(this.person).
        subscribe(person => this.person = person);
    } else {
      this.personService.createPerson(this.person).
        subscribe(person => this.person = person);      
    }
  }
}
