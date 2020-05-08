import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService, ProgramService } from 'sc-common';
import { SCValidation } from 'sc-common';

import { RoomService } from '../../sccommon/services/room.service';

import { ClassroomService } from '../services/classroom.service';
import { CatechistService } from '../services/catechist.service';

@Component({
  selector: 'app-catechist-dialog',
  templateUrl: './catechist-dialog.component.html',
  styleUrls: ['./catechist-dialog.component.scss']
})
export class CatechistDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0, Validators.required],
      programId: ['', Validators.required],
      classroomId: [''],
    });

  constructor(public dialogRef: MatDialogRef<CatechistDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public programService: ProgramService,
              public classroomService: ClassroomService,
              public catechistService: CatechistService,
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

    const value = this.form.value;
    if(this.data.item.id > 0) {
      this.catechistService.update(value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.catechistService.create(value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

}
