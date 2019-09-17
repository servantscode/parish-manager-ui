import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService } from 'sc-common';

import { SCValidation } from '../../sccommon/validation';

import { ProgramService } from '../services/program.service';
import { ProgramGroupService } from '../services/program-group.service';


@Component({
  selector: 'app-program-dialog',
  templateUrl: './program-dialog.component.html',
  styleUrls: ['./program-dialog.component.scss']
})
export class ProgramDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      groupId: ['', Validators.required],
      coordinatorId: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<ProgramDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private programService: ProgramService,
              public programGroupService: ProgramGroupService,
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
      this.programService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.programService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
