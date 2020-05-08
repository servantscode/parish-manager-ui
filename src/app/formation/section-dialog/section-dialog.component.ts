import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { format } from 'date-fns';

import { SCValidation } from 'sc-common';

import { DateService, ProgramService, SectionService } from 'sc-common';

@Component({
  selector: 'app-section-dialog',
  templateUrl: './section-dialog.component.html',
  styleUrls: ['./section-dialog.component.scss']
})
export class SectionDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      programId: ['', Validators.required],
      recurrenceId: [''],
      dayTime: this.fb.group({
        dayOfWeek: '',
        timeOfDay: '',
      })
    });

  public days = this.dateService.daysOfWeek.bind(this.dateService);

  constructor(public dialogRef: MatDialogRef<SectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public programService: ProgramService,
              public sectionService: SectionService,
              public dateService: DateService) { }
  
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

    const value = this.form.value;
    if(this.form.get("id").value > 0) {
      this.sectionService.update(value, {"programId": value.programId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.sectionService.create(value, {"programId": value.programId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}