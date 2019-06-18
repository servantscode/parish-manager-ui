import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from '../../sccommon/validation';

import { FundService } from '../services/fund.service';

@Component({
  selector: 'app-fund-dialog',
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.scss']
})
export class FundDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
    });

  constructor(public dialogRef: MatDialogRef<FundDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private fundService: FundService) { }
  
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
      this.fundService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.fundService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
