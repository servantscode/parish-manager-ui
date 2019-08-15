import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { SaveSearchDialogComponent } from '../save-search-dialog/save-search-dialog.component';

import { LoginService } from '../services/login.service';
import { SearchService } from '../services/search.service';

import { SCValidation } from '../validation';
import { SavedSearch } from '../saved-search';

import { deepEqual } from '../utils';

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

  form = this.fb.group({
      input: ['', SCValidation.validSearch()],
      savedSearch: ['']
    });

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
        this.savedSearch = savedSearch;
        this.form.get('input').setValue(savedSearch.search);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!deepEqual(changes.searchForm.currentValue, changes.searchForm.previousValue)) {
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
  }
}
