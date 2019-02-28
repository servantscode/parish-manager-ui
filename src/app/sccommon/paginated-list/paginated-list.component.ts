import { Component, OnInit, HostListener, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';

import { PaginatedService } from '../services/paginated.service';
import { LoginService } from '../services/login.service';

import { Identifiable } from '../identifiable';

export enum KEY_CODE {
  PLUS = 107,
  EQUALS = 187,
  ENTER = 13,
  UP = 38,
  DOWN = 40
}

@Component({
  selector: 'app-paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss']
})
export class PaginatedListComponent<T extends Identifiable> implements OnInit {
  @Input() dataService: PaginatedService<T>;
  @Input() fields: string[];
  @Input() pageSize: number = 20;
  @Input() dialogComponent = null;

  @Input() newItemTemplate:any;

  @Input() selectable: boolean = false;
  @Output() onSelect: EventEmitter<T> = new EventEmitter<T>(); 
  @Input() refreshOn: Subject<any>;

  items: T[] = [];

  highlighted: T = null;
  selected: T = null;

  page = 1;
  totalCount = 0;
  search = '';

  openDialogRef = null;

  constructor(private dialog: MatDialog,
              private loginService: LoginService) { }

  ngOnInit() {
    this.populateList();

    if (this.refreshOn) {
      this.refreshOn.subscribe((event) => {
        this.populateList();
      });
    }
  }

  populateList() {
    if(!this.verifyPermission("list"))
      return;
    
    this.dataService.getPage((this.page-1)*this.pageSize, this.pageSize, this.search).
      subscribe(resp => {
        this.items = resp.results;
        this.totalCount = resp.totalResults;
      });
  }

  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {    
  //   if (event.keyCode === KEY_CODE.DOWN) {
  //     if(this.highlighted == null) {
  //       this.highlight(this.items[0]);
  //     } else if (this.highlighted !== this.items[this.items.length -1]) {
  //       this.highlight(this.items[this.items.indexOf(this.highlighted) + 1]);
  //     }
  //   }

  //   if (event.keyCode === KEY_CODE.UP) {
  //     if(this.highlighted == null) {
  //       this.highlight(this.items[0]);
  //     } else if (this.highlighted != this.items[0]) {
  //       this.highlight(this.items[this.items.indexOf(this.highlighted) - 1]);
  //     }
  //   }

  //   if(event.keyCode === KEY_CODE.ENTER && this.highlighted != null) {
  //     this.navigate(this.highlighted.id);
  //   }
  // }

  openModal(item: T) {
    if(!item && !this.verifyPermission("create"))
      return;
    else if(item && !this.verifyPermission("update"))
      return;

    if(this.openDialogRef != null)
      return;

    if(!item)
      item = this.newItemTemplate;

    this.openDialogRef = this.dialog.open(this.dialogComponent, {
      width: '400px',
      data: {"item": item}
    });

   this.openDialogRef.afterClosed().subscribe(result => {
      this.openDialogRef= null;
      this.populateList();
    });
  }

  edit(item: T) {
    this.openModal(item);
  }

  clicked(item: T) {
    if(this.selectable) {
      this.selected = item;
      this.onSelect.emit(item);
    } else {
      this.openModal(item);
    }
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

  verifyPermission(action: string): boolean {
    const permType = this.dataService.getPermissionType();
    return this.loginService.userCan(permType + "." + action);
  }
}