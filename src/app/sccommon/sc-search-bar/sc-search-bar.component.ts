import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

import { SCValidation } from '../validation';

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

  form = this.fb.group({
      input: ['', SCValidation.validSearch()]
    });

  constructor(private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.form.get('input').valueChanges
      .pipe(debounceTime(200))
      .subscribe(search => {
        if(this.form.valid)
          this.search.emit(search);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!deepEqual(changes.searchForm.currentValue, changes.searchForm.previousValue))
      this.form.get('input').setValue('');
  }

  openSearch() {
    const searchRef = this.dialog.open(SearchDialogComponent, {
      width: '400px',
      data: {"title": "Search " + this.type,
             "fields" : this.searchForm
           }
    });

    searchRef.afterClosed().subscribe(result => {
        if(result)
          this.form.get('input').setValue(result);
      });
  }
}
