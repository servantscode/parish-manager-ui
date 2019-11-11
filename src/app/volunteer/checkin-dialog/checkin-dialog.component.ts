import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation, PersonService } from 'sc-common';

import { CheckinService } from '../services/checkin.service';

import { addHours, startOfHour } from 'date-fns';


@Component({
  selector: 'app-checkin-dialog',
  templateUrl: './checkin-dialog.component.html',
  styleUrls: ['./checkin-dialog.component.scss']
})
export class CheckinDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      personId: ['', Validators.required],
      expiration: [startOfHour(addHours(new Date(), 3)), Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<CheckinDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private checkinService: CheckinService,
              public personService: PersonService) { }
  
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
      this.checkinService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.checkinService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
