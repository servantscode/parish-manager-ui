import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

import { PaginatedService } from 'sc-common';
import { LoginService } from 'sc-common';

import { PaginatedResponse } from 'sc-common';
import { Identifiable } from 'sc-common';
import { CustomControl } from '../custom-control';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

import { SCValidation } from 'sc-common';
import { doLater } from '../../sccommon/utils';

@Component({
  selector: 'app-paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss']
})
export class PaginatedListComponent<T extends Identifiable> implements OnInit {
  @Input() dataService: PaginatedService<T>;
  @Input() pageImpl: (start:number, count:number, search:string) => Observable<PaginatedResponse<T>> = null;

  @Input() fields: string[];
  @Input() customControls: CustomControl<T>[];
  @Input() pageSize: number = 20;
  @Input() dialogComponent = null;
  @Input() dialogWidth = 400;
  @Input() searchFilter = null;

  @Input() newItemTemplate:any = null;

  @Input() selectable: boolean = false;
  @Input() allowCreate: boolean = true;
  @Output() onSelect: EventEmitter<T> = new EventEmitter<T>(); 
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>(); 
  @Input() refreshOn: Subject<any>;

  @Input() pathParams: any = null;

  @Input() searchForm: any[];
  @Input() type: string;
  @Input() placeholderValue: string = "";

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
        doLater(function () {this.populateList()}.bind(this));
      });
    }
  }

  updateSearch(search:string) {
    this.search = search;
    this.onSearch.emit(search);
    this.populateList();
  }

  populateList() {
    if(!this.verifyPermission("list"))
      return;
    
    const search = this.search + (this.searchFilter? " " + this.searchFilter: '');
    var observable: Observable<PaginatedResponse<T>> = this.pageImpl?
      this.pageImpl((this.page-1)*this.pageSize, this.pageSize, search): 
      this.dataService.getPage((this.page-1)*this.pageSize, this.pageSize, search, this.pathParams);

    observable.
      subscribe(resp => {
        this.items = resp.results;
        this.totalCount = resp.totalResults;
      });
  }

  openModal(item: T) {
    if(!item && !this.verifyPermission("create"))
      return;
    else if(item && !this.verifyPermission("update"))
      return;

    if(!this.dialogComponent || this.openDialogRef)
      return;

    if(!item)
      item = this.newItemTemplate;

    this.openDialogRef = this.dialog.open(this.dialogComponent, {
      width: this.dialogWidth + 'px',
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

  delete(item: T) {
    if(!this.verifyPermission("delete"))
      return;

    this.openDialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + item.identify() + "?",
             "delete": (): Observable<void> => { 
                 return this.dataService.delete(item, false, this.pathParams); 
               }
            }
    });

    this.openDialogRef.afterClosed().subscribe(result => {
      this.openDialogRef= null;
      this.populateList();
    });
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
    const prefix = this.dataService.deleteRequiresAdmin()? "admin.": ""
    return this.loginService.userCan(prefix + permType + "." + action);
  }

  formatFieldName(field: any): string {
    var fieldName = this.fieldName(field);
    var bits = fieldName.split(/(?=[A-Z])/);
    return bits.join(" ");
  }

  fieldName(field:any): string {
    return typeof field === 'string' ? field : field.name;
  }

  fieldType(field:any): string {
    return typeof field === 'string' ? 'string' : field.type;
  }
}