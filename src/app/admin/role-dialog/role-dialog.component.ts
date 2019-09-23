import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { RoleService } from '../services/role.service';
import { SCValidation } from 'sc-common';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required]
    });

  permissions: string[] = [];

  constructor(public dialogRef: MatDialogRef<RoleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private roleService: RoleService) { }
  
  ngOnInit() {
    if(this.data.item != null) {
      this.form.patchValue(this.data.item)
      this.permissions = this.data.item.permissions;

      if(this.data.item.name === "system")
        this.disableAll();
    }
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    var role = this.form.value;
    role.permissions = this.permissions;

    if(role.id > 0) {
      this.roleService.update(role).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.roleService.create(role).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  private disableAll() {
    for(let control in this.form.controls)
      this.form.get(control).disable();
  }

}
