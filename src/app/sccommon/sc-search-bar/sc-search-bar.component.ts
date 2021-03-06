import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { SaveSearchDialogComponent } from '../save-search-dialog/save-search-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

import { LoginService } from 'sc-common';
import { SearchService } from '../services/search.service';

import { SCValidation } from '../validation';
import { SavedSearch } from '../saved-search';

import { deepEqual, doLater } from '../utils';

@Component({
  selector: 'app-sc-search-bar',
  templateUrl: './sc-search-bar.component.html',
  styleUrls: ['./sc-search-bar.component.scss']
})
export class ScSearchBarComponent implements OnInit, OnChanges {
  @Output() search = new EventEmitter<string>();
  @Input() type: string;
  @Input() searchForm: any[];
  @Input() columns: 1;

  savedSearch: SavedSearch = null;

  @ViewChild('savedSearchInput', {static: false}) ssInput:any;

  form = this.fb.group({
      input: ['', SCValidation.validSearch()],
      savedSearch: ['']
    });

  findSearch: boolean = false;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private loginService: LoginService,
              public searchService: SearchService) { }

  ngOnInit() {
    this.form.get('input').valueChanges
      .pipe(debounceTime(200))
      .subscribe(search => {
        if(this.form.valid)
          this.search.emit(search);
      });

    this.form.get('savedSearch').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(savedSearch => {
        if(savedSearch) {
          this.savedSearch = savedSearch;
          this.form.get('input').setValue(savedSearch.search);
          this.findSearch = false;
        }
      });
  }

  toggleSavedSearchMode() {
    this.findSearch = !this.findSearch;
    if(this.findSearch)
      doLater(function () {this.ssInput.setFocus()}.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.searchForm && !deepEqual(changes.searchForm.currentValue, changes.searchForm.previousValue)) {
      this.form.get('input').setValue('');
      this.form.get('savedSearch').setValue(null);
      this.savedSearch = null;
    }
  }

  openSearch() {
    const searchRef = this.dialog.open(SearchDialogComponent, {
      width: 4*this.columns + '00px',
      data: {"title": this.type + " Search",
             "columns": this.columns,
             "fields" : this.searchForm
           }
    });

    searchRef.afterClosed().subscribe(result => {
        if(result)
          this.form.get('input').setValue(result);
      });
  }

  saveSearch() {
    var savedSearch = this.savedSearch? this.savedSearch: new SavedSearch();
    savedSearch.searchType = this.type.toUpperCase().replace(' ', '_');
    savedSearch.search = this.form.get('input').value;
    savedSearch.searcherId = this.loginService.getUserId();

    const saveRef = this.dialog.open(SaveSearchDialogComponent, {
        width: '400px',
        data: { "savedSearch": savedSearch }
      });

    saveRef.afterClosed().subscribe(result => {
        if(result)
          this.savedSearch = result;
      });
  }

  clearSearch() {
    this.savedSearch = null;
    this.form.get('input').setValue('');
    this.form.get('savedSearch').setValue('');
  }

  deleteSearch() {
   const saveRef = this.dialog.open(DeleteDialogComponent, {
        width: '400px',
        data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete search \"" + this.savedSearch.name + "\"?",
             "delete": (): Observable<void> => { 
                 return this.searchService.delete(this.savedSearch);
               }
            }
      });

    saveRef.afterClosed().subscribe(result => {
        this.clearSearch();
      });
  }
}
