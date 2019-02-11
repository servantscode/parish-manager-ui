import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../sccommon/services/login.service';

import { Person } from '../person';
import { Family } from '../family';
import { PersonService } from '../services/person.service';
import { FamilyService } from '../services/family.service';


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

  mode = "person";

  constructor(private personService: PersonService,
              private familyService: FamilyService,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    if(this.mode == "person") {
      this.getPeople();
    } else if(this.mode == "family") {
      this.getFamilies();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      if(!this.loginService.userCan(this.mode + '.create'))
        return;
      this.router.navigate([this.mode, 'detail']);
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
      if(!this.loginService.userCan(this.mode + '.read'))
        return;
      this.router.navigate([this.mode, 'detail', this.highlighted.id]);
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
    if(!this.loginService.userCan('person.list'))
      return;

    this.personService.getPage((this.page-1)*this.pageSize, this.pageSize, this.search)
      .subscribe(peopleResp => {
        this.items = peopleResp.results;
        this.totalCount = peopleResp.totalResults;
      });
  }

  getFamilies(): void {
    if(!this.loginService.userCan('family.list'))
      return;

    this.familyService.getFamilies((this.page-1)*this.pageSize, this.pageSize, this.search).
      subscribe(familyResp => {
        this.items = familyResp.results;
        this.totalCount = familyResp.totalResults;
      });
  }

  viewDetails(item: any) {
    if(!this.loginService.userCan(this.mode + '.read'))
      return;
    this.router.navigate([this.mode, 'detail', item.id]);
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

  //Handles any object with an address in the tree, at this point Person or Family
  getAddressString(obj: any): string {
    if(obj == null || obj == undefined)
      return "";

    var candidateFamily = obj.family;
    if(candidateFamily !== null && candidateFamily !== undefined) {
      return this.getAddressString(candidateFamily);
    }

    //Has to be a family now
    if(obj.address == null || obj.address == undefined)
      return "";

    const addr = obj.address;
    return addr.street1 + " " + addr.city + ", " + addr.state + " " + addr.zip;
  }
}
