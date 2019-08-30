import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { SCValidation } from '../../sccommon/validation';

import { EventService } from '../../schedule/services/event.service';

import { SectionService } from '../services/section.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-link-session-dialog',
  templateUrl: './link-session-dialog.component.html',
  styleUrls: ['./link-session-dialog.component.scss']
})
export class LinkSessionDialogComponent implements OnInit {
  form = this.fb.group({
      programId: [0, Validators.required],
      event: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<LinkSessionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                programId: number
              },
              private fb: FormBuilder,
              private sessionService: SessionService, 
              public eventService: EventService) { }
  
  ngOnInit() {
    if(this.data.programId <= 0)
      alert("No programId provided");
    
    this.form.patchValue(this.data);
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const formData = this.form.value;

    if(!formData.event || !formData.event.recurrence) {
      alert("No recurring event selected.");
      this.cancel();
    }

    this.sessionService.link(formData.programId, formData.event.recurrence.id).
      subscribe(() => this.dialogRef.close());
  }

  cancel() {
    this.dialogRef.close();    
  }
}
