import { Component, OnInit, HostListener } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../services/person.service';
import { Router } from '@angular/router';


export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187,
  ENTER = 13,
  UP = 38,
  DOWN = 40
}

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})

export class PersonComponent implements OnInit {
  people: Person[] = [];
  highlightedPerson = null;
  page = 1;
  pageSize = 20;
  totalCount = 110;
  search = '';

  constructor(private personService: PersonService,
              private router: Router) { }

  ngOnInit() {
    this.getPeople();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.router.navigate(['person', 'detail'])
    }

    if (event.keyCode === KEY_CODE.DOWN) {
      if(this.highlightedPerson == null) {
        this.highlightPerson(this.people[0]);
      } else if (this.highlightedPerson !== this.people[this.people.length -1]) {
        this.highlightPerson(this.people[this.people.indexOf(this.highlightedPerson) + 1]);
      }
    }

    if (event.keyCode === KEY_CODE.UP) {
      if(this.highlightedPerson == null) {
        this.highlightPerson(this.people[0]);
      } else if (this.highlightedPerson != this.people[0]) {
        this.highlightPerson(this.people[this.people.indexOf(this.highlightedPerson) - 1]);
      }
    }

    if(event.keyCode === KEY_CODE.ENTER) {
      if(this.highlightedPerson != null) {
        this.router.navigate(['person', 'detail', this.highlightedPerson.id])
      }
    }

  }

  getPeople(): void {
    this.personService.getPeople((this.page-1)*this.pageSize, this.pageSize, this.search).
      subscribe(peopleResp => {
        this.people = peopleResp.results;
        this.totalCount = peopleResp.totalResults;
      });
  }

  highlightPerson(person: Person) {
    this.highlightedPerson = person;
  }

  pageStart(): number {
    return (this.page-1)*this.pageSize+1;
  }

  pageEnd(): number {
    var pageEnd = (this.page)*this.pageSize;
    return pageEnd > this.totalCount? this.totalCount: pageEnd;
  }

}
