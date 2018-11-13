import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MinistryService } from '../services/ministry.service';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187,
  ENTER = 13,
  UP = 38,
  DOWN = 40
}

@Component({
  selector: 'app-ministry-list',
  templateUrl: './ministry-list.component.html',
  styleUrls: ['./ministry-list.component.scss']
})
export class MinistryListComponent implements OnInit {

  items: any[] = [];

  highlighted = null;

  page = 1;
  pageSize = 20;
  totalCount = 0;
  search = '';

  constructor(private ministryService: MinistryService,
              private router: Router) { }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    this.getMinistries();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.keyCode === KEY_CODE.PLUS || 
        event.keyCode === KEY_CODE.EQUALS && event.shiftKey) {
      this.router.navigate(['ministry', 'detail']);
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
      this.router.navigate(['ministry', 'detail', this.highlighted.id]);
    }
  }

  getMinistries(): void {
    this.ministryService.getMinistries((this.page-1)*this.pageSize, this.pageSize, this.search).
      subscribe(ministryResp => {
        this.items = ministryResp.results;
        this.totalCount = ministryResp.totalResults;
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
}
