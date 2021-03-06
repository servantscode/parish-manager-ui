import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { ProgramGroupService } from '../services/program-group.service';

@Component({
  selector: 'app-program-group-dialog',
  templateUrl: './program-group-dialog.component.html',
  styleUrls: ['./program-group-dialog.component.scss']
})
export class ProgramGroupDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      complete: false
    });

  constructor(public dialogRef: MatDialogRef<ProgramGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private programGroupService: ProgramGroupService) { }
  
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
      this.programGroupService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.programGroupService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
