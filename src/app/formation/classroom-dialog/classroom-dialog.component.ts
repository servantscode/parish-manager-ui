import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService } from 'sc-common';

import { SCValidation } from 'sc-common';

import { RoomService } from '../../sccommon/services/room.service';

import { ProgramService } from '../services/program.service';
import { SectionService } from '../services/section.service';
import { ClassroomService } from '../services/classroom.service';

@Component({
  selector: 'app-classroom-dialog',
  templateUrl: './classroom-dialog.component.html',
  styleUrls: ['./classroom-dialog.component.scss']
})
export class ClassroomDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      programId: ['', Validators.required],
      sectionId: ['', Validators.required],
      instructorId: [''],
      roomId: [''],
      complete: ['']
    });

  constructor(public dialogRef: MatDialogRef<ClassroomDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public programService: ProgramService,
              public classroomService: ClassroomService,
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
      this.classroomService.update(value, {"programId": value.programId, "sectionId": value.sectionId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.classroomService.create(value, {"programId": value.programId, "sectionId": value.sectionId}).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
