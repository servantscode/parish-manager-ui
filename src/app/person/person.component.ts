import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { PersonResponse } from '../personResponse';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  people: Person[];

  selectedPerson: Person; 

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personService.getPeople().
      subscribe(personResponse => this.people = personResponse.results);
  }
}
