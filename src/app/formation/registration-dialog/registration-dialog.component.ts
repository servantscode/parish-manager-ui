import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonService } from 'sc-common';

import { SCValidation } from 'sc-common';

import { RoomService } from '../../schedule/services/room.service';

import { ProgramService } from '../services/program.service';
import { ClassroomService } from '../services/classroom.service';
import { RegistrationService } from '../services/registration.service';
import { SacramentalGroupService } from '../services/sacramental-group.service';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.scss']
})
export class RegistrationDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      enrolleeId: ['', Validators.required],
      programId: ['', Validators.required],
      classroomId: [''],
      schoolGrade: [''],
      sacramentalGroupId: ['']
    });

  constructor(public dialogRef: MatDialogRef<RegistrationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public programService: ProgramService,
              public classroomService: ClassroomService,
              public registrationService: RegistrationService,
              public sacramentalGroupService: SacramentalGroupService,
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
      this.registrationService.update(value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.registrationService.create(value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
