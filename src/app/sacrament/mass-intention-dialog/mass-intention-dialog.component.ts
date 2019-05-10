import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from '../../sccommon/validation';

import { MassIntentionService } from '../services/mass-intention.service';

import { PersonService } from '../../sccommon/services/person.service';

@Component({
  selector: 'app-mass-intention-dialog',
  templateUrl: './mass-intention-dialog.component.html',
  styleUrls: ['./mass-intention-dialog.component.scss']
})
export class MassIntentionDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      eventId: [0],
      person: [null, Validators.required],
      intentionType: ['', Validators.required],
      requester: [null, Validators.required],
      requesterPhone: ['', Validators.pattern(SCValidation.PHONE)]
    });

  public intentionTypes = this.massIntentionService.getIntentionTypes.bind(this.massIntentionService);

  constructor(public dialogRef: MatDialogRef<MassIntentionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private massIntentionService: MassIntentionService,
              private personService: PersonService) { }
  
  ngOnInit() {
    if(this.data.item)
      this.form.patchValue(this.data.item)

    this.form.get('requester').valueChanges.subscribe(val => {
        if(val.id) {
          this.personService.get(val.id).subscribe(person => {
              if(person.phoneNumber)
                this.form.get('requesterPhone').setValue(person.phoneNumber);
            });
        }
      });
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.massIntentionService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.massIntentionService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
