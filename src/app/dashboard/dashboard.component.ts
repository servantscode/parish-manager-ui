import { Component, OnInit, HostListener } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../services/person.service';
import { Router } from '@angular/router';


export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187
}

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
  search = '';

  constructor(private personService: PersonService,
              private router: Router) { }

  ngOnInit() {
    this.getPeople();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.PLUS) {
      this.router.navigate(['detail'])
    }

    if (event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.router.navigate(['detail'])
      
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
