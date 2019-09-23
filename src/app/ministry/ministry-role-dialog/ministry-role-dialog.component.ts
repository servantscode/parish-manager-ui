import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { MinistryRoleService } from '../services/ministry-role.service';

@Component({
  selector: 'app-ministry-role-dialog',
  templateUrl: './ministry-role-dialog.component.html',
  styleUrls: ['./ministry-role-dialog.component.scss']
})
export class MinistryRoleDialogComponent implements OnInit {

  form = this.fb.group({
      id: 0,
      ministryId: [null, Validators.required],
      name: ['', Validators.required],
      leader: false,
      contact: false
    });

  constructor(public dialogRef: MatDialogRef<MinistryRoleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private ministryRoleService: MinistryRoleService) { }
  
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
      this.ministryRoleService.update(this.form.value, {'id': this.ministryId()}).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.ministryRoleService.create(this.form.value, {'id': this.ministryId()}).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  private ministryId() {
    return this.form.get('ministryId').value;
  }

  cancel() {
    this.dialogRef.close();    
  }
}
