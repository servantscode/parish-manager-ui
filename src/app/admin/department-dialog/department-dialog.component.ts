import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { DepartmentService } from '../../sccommon/services/department.service';
import { PersonService } from '../../sccommon/services/person.service';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.scss']
})
export class DepartmentDialogComponent implements OnInit {


  form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      departmentHeadId: ['', Validators.required],
    });

  createNew: boolean = true;

  constructor(public dialogRef: MatDialogRef<DepartmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public personService: PersonService,
              private departmentService:DepartmentService) { }

  ngOnInit() {
    if(this.data.item) {
      this.form.patchValue(this.data.item);
      if(this.data.item.id)
        this.createNew = false;
    }
  }

  createDepartment() {
    if(this.form.valid) {
      if(this.createNew) {
        this.departmentService.create(this.form.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.departmentService.update(this.form.value).
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
