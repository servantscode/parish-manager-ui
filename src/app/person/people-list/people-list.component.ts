import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DownloadService } from '../../sccommon/services/download.service';
import { LoginService } from '../../sccommon/services/login.service';
import { PersonService } from '../../sccommon/services/person.service';

import { Person } from '../../sccommon/person';
import { Family } from '../../sccommon/family';

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
  includeInactive = false;

  mode = "person";

  constructor(private personService: PersonService,
              private familyService: FamilyService,
              public loginService: LoginService,
              private downloadService: DownloadService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.populateList();
  }

  updateSearch(search:string) {
    this.search = search;
    this.populateList();
  }

  populateList() {
    if(this.mode == "person") {
      this.getPeople();
    } else if(this.mode == "family") {
      this.getFamilies();
    }
  }

  getSearchForm(): any[] {
    if(this.mode == "person") {
      return [{"name":"name", "type":"text"},
              {"name":"male", "type":"boolean", "displayName":"Gender", "yesValue":"male", "noValue":"female"},
              {"name":"birthdate", "type":"date"},
              {"name":"parishioner", "displayName":"Parishioner?", "type":"boolean"},
              {"name":"memberSince", "type":"date"}];
    } else if(this.mode == "family") {
      return [{"name":"surname", "type":"text"},
              {"name":"address.city", "type":"text", "displayName":"City"},
              {"name":"address.state", "type":"text", "displayName":"State"},
              {"name":"address.zip", "type":"number", "displayName":"Zip Code"},
              {"name":"envelopeNumber", "type":"number"}];
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

      if(this.mode === 'family')
        this.router.navigate(['family', 'detail', this.highlighted.id]);
      else
        this.router.navigate(['person', this.highlighted.id, 'detail']);
    }
  }

  changeMode() {
    this.items = [];

    this.highlighted = null;

    this.page = 1;
    this.pageSize = 20;
    this.totalCount = 0;
    this.search = '';
  }

  getPeople(): void {
    if(!this.loginService.userCan('person.list'))
      return;

    this.personService.getPage((this.page-1)*this.pageSize, this.pageSize, this.search, this.includeInactive)
      .subscribe(peopleResp => {
        this.items = peopleResp.results;
        this.totalCount = peopleResp.totalResults;
      });
  }

  getFamilies(): void {
    if(!this.loginService.userCan('family.list'))
      return;

    this.familyService.getPage((this.page-1)*this.pageSize, this.pageSize, this.search, this.includeInactive).
      subscribe(familyResp => {
        this.items = familyResp.results;
        this.totalCount = familyResp.totalResults;
      });
  }

  viewDetails(item: any) {
    if(!this.loginService.userCan(this.mode + '.read'))
      return;

    if(this.mode === 'family')
      this.router.navigate(['family', 'detail', item.id]);
    else
      this.router.navigate(['person', item.id, 'detail']);
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

  downloadReport() {
    const filename = this.mode + "-report-" + formatDate(new Date(), "yyyy-MM-dd", "en_US") + ".csv";
    const service = (this.mode === "person")? this.personService: this.familyService;

    this.downloadService.downloadReport(service.getReport(this.search, this.includeInactive), filename);
  }
}
