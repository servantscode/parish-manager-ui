import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { CategoryService } from '../../sccommon/services/category.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

  form = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });

  createNew: boolean = true;

  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private categoryService: CategoryService) { }

  ngOnInit() { 
    if(this.data.item) {
      this.form.patchValue(this.data.item);
      if(this.data.item.id)
        this.createNew = false;
    }
  }

  createCategory() {
    if(this.form.valid) {
      if(this.createNew) {
        this.categoryService.create(this.form.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.categoryService.update(this.form.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      }
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  formData() {
    alert(JSON.stringify(this.form.value));
  }
}
