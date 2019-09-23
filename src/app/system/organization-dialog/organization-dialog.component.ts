import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { OrganizationService } from 'sc-common';

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],

})
export class OrganizationDialogComponent implements OnInit {

  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      hostName: ['', Validators.required],
    });

  constructor(public dialogRef: MatDialogRef<OrganizationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private organizationService: OrganizationService) { }
  
  ngOnInit() {
    if(this.data.item != null) {
      this.form.patchValue(this.data.item)
    }
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.organizationService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.organizationService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
