import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from '../../sccommon/validation';

import { SacramentalGroupService } from '../services/sacramental-group.service';

@Component({
  selector: 'app-sacramental-group-dialog',
  templateUrl: './sacramental-group-dialog.component.html',
  styleUrls: ['./sacramental-group-dialog.component.scss']
})

export class SacramentalGroupDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<SacramentalGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private sacramentalGroupService: SacramentalGroupService) { }
  
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
      this.sacramentalGroupService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.sacramentalGroupService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
