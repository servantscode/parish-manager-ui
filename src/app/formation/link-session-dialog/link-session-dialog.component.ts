import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { EventService } from '../../schedule/services/event.service';

import { SectionService } from '../services/section.service';
import { SessionService } from '../services/session.service';

import { Section } from '../formation';

@Component({
  selector: 'app-link-session-dialog',
  templateUrl: './link-session-dialog.component.html',
  styleUrls: ['./link-session-dialog.component.scss']
})
export class LinkSessionDialogComponent implements OnInit {
  form = this.fb.group({
      event: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<LinkSessionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                section: Section
              },
              private fb: FormBuilder,
              private sectionService: SectionService,
              private sessionService: SessionService, 
              public eventService: EventService) { }
  
  ngOnInit() {
    if(!this.data.section)
      alert("No section provided");
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
    // this.sessionService.link(formData.programId, formData.event.recurrence.id).
    //   subscribe(() => this.dialogRef.close());

    const section = this.data.section;

    section.recurrenceId = formData.event.recurrence.id;
    
    this.sectionService.update(section, {"programId": section.programId}).subscribe(resp => this.dialogRef.close(resp));
  }

  cancel() {
    this.dialogRef.close();    
  }
}
