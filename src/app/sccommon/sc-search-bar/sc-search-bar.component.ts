import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material';

import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

import { SCValidation } from '../validation';

@Component({
  selector: 'app-sc-search-bar',
  templateUrl: './sc-search-bar.component.html',
  styleUrls: ['./sc-search-bar.component.scss']
})
export class ScSearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Input() type: string;

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

  openSearch() {
    const donationRef = this.dialog.open(SearchDialogComponent, {
      width: '400px',
      data: {"title": "Search People",
             "fields" : {
               "name": "text",
               "male": "boolean",
               "birthdate": "date"
           }}
    });

    donationRef.afterClosed().subscribe(result => {
        if(result)
          this.form.get('input').setValue(result);
      });
  }
}
