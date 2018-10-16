import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  people: Person[] = [];
  highlightedPerson = null;
  page = 1;
  pageSize = 10;
  totalCount = 110;

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.getPeople();
  }

  getPeople(): void {
    this.personService.getPeople((this.page-1)*this.pageSize, this.pageSize).
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
