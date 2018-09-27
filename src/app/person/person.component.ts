import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { PEOPLE } from '../mock-people';
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
      subscribe(people => this.people = people);
  }
}
