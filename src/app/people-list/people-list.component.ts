import { Component, OnInit, HostListener } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../services/person.service';
import { FamilyService } from '../services/family.service';
import { Router } from '@angular/router';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187,
  ENTER = 13,
  UP = 38,
  DOWN = 40
}

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  items: any[] = [];

  highlighted = null;

  page = 1;
  pageSize = 20;
  totalCount = 0;
  search = '';

  mode = "people";

  constructor(private personService: PersonService,
              private familyService: FamilyService,
              private router: Router) { }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    if(this.mode == "people") {
      this.getPeople();
    } else if(this.mode == "families") {
      this.getFamilies();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      if(this.mode === "people") {
        this.router.navigate(['person', 'detail']);
      } else if(this.mode === "families") {
        this.router.navigate(['family', 'detail']);
      }
    }

    if (event.keyCode === KEY_CODE.DOWN) {
      if(this.highlighted == null) {
        this.highlight(this.items[0]);
      } else if (this.highlighted !== this.items[this.items.length -1]) {
        this.highlight(this.items[this.items.indexOf(this.highlighted) + 1]);
      }
    }

    if (event.keyCode === KEY_CODE.UP) {
      if(this.highlighted == null) {
        this.highlight(this.items[0]);
      } else if (this.highlighted != this.items[0]) {
        this.highlight(this.items[this.items.indexOf(this.highlighted) - 1]);
      }
    }

    if(event.keyCode === KEY_CODE.ENTER && this.highlighted != null) {
      if(this.mode === "people") {
        this.router.navigate(['person', 'detail', this.highlighted.id]);
      } else if(this.mode === "families") {
        this.router.navigate(['family', 'detail', this.highlighted.id]);
      }
    }
  }

  changeMode() {
    this.items = [];

    this.highlighted = null;

    this.page = 1;
    this.pageSize = 20;
    this.totalCount = 0;
    this.search = '';

    this.populateList();
  }

  getPeople(): void {
    this.personService.getPeople((this.page-1)*this.pageSize, this.pageSize, this.search)
      .subscribe(peopleResp => {
        this.items = peopleResp.results;
        this.totalCount = peopleResp.totalResults;
      });
  }

  getFamilies(): void {
    this.familyService.getFamilies((this.page-1)*this.pageSize, this.pageSize, this.search).
      subscribe(familyResp => {
        this.items = familyResp.results;
        this.totalCount = familyResp.totalResults;
      });
  }


  highlight(item: any) {
    this.highlighted = item;
  }

  pageStart(): number {
    return (this.page-1)*this.pageSize+1;
  }

  pageEnd(): number {
    var pageEnd = (this.page)*this.pageSize;
    return pageEnd > this.totalCount? this.totalCount: pageEnd;
  }

  getAddressString(person: Person): string {
    if(person == null || person == undefined)
      return "";
    if(person.family == null || person.family == undefined)
      return "";
    if(person.family.address == null || person.family.address == undefined)
      return "";

    const addr = person.family.address;
    return addr.street1 + " " + addr.city + ", " + addr.state + " " + addr.zip;
  }
}
