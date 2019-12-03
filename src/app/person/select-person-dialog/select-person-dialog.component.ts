import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { SCValidation } from 'sc-common';

import { PersonService } from 'sc-common';

@Component({
  selector: 'app-select-person-dialog',
  templateUrl: './select-person-dialog.component.html',
  styleUrls: ['./select-person-dialog.component.scss']
})
export class SelectPersonDialogComponent implements OnInit {
  form = this.fb.group({
      person: [0, Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<SelectPersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public personService: PersonService) { }
  
  ngOnInit() {
    if(this.data && this.data.item)
      this.form.patchValue(this.data.item)
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const person = this.form.get("person").value;
    this.dialogRef.close(person);
  }

  cancel() {
    this.dialogRef.close();    
  }
}
