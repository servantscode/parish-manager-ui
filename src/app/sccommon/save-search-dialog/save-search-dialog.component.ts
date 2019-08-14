import { Component, OnInit, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import { SearchService } from '../services/search.service';

import { SavedSearch } from '../saved-search';

@Component({
  selector: 'app-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.scss']
})
export class SaveSearchDialogComponent implements OnInit {

  form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      search: ['', Validators.required],
      searchType: ['', Validators.required],
      searcherId: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<SaveSearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {savedSearch: SavedSearch},
              private fb: FormBuilder,
              private searchService: SearchService) { }

  ngOnInit() {
    this.form.patchValue(this.data.savedSearch);
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.searchService.update(this.form.value).
        subscribe(result => {
          this.dialogRef.close(result);
        });
    } else {
      this.searchService.create(this.form.value).
        subscribe(result => {
          this.dialogRef.close(result);
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
