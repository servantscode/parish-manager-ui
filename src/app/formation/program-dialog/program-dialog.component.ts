import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService, ProgramService } from 'sc-common';
import { SCValidation } from 'sc-common';

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

    const section = this.form.value;
    if(this.form.get("id").value > 0) {
      this.programService.update(section, {"programId": section.programId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.programService.create(section, {"programId": section.programId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
