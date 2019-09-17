import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService } from 'sc-common';

import { SCValidation } from '../../sccommon/validation';

import { RoomService } from '../../schedule/services/room.service';

import { ProgramService } from '../services/program.service';
import { SectionService } from '../services/section.service';

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
      instructorId: [''],
      roomId: [''],
      complete: ['']
    });

  constructor(public dialogRef: MatDialogRef<SectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public programService: ProgramService,
              public sectionService: SectionService,
              public roomService: RoomService,
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
