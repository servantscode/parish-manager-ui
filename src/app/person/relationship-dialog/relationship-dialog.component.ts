import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { SCValidation } from 'sc-common';

import { RelationshipService } from 'sc-common';

import { Relationship } from 'sc-common';

@Component({
  selector: 'app-relationship-dialog',
  templateUrl: './relationship-dialog.component.html',
  styleUrls: ['./relationship-dialog.component.scss']
})
export class RelationshipDialogComponent implements OnInit {
  form = this.fb.group({
      personId: [0, Validators.required],
      otherId: [0, Validators.required],
      relationship: [null, Validators.required],
      guardian: [false],
      contactPreference: [''],
      doNotContact: [false]
    });

  public relationshipTypes = this.relationshipService.getRelationshipTypes.bind(this.relationshipService);

  constructor(public dialogRef: MatDialogRef<RelationshipDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public relationshipService: RelationshipService) { }
  
  ngOnInit() {
    if(this.data.item)
      this.form.patchValue(this.data.item)

    this.form.get('relationship').valueChanges.subscribe(relationship => {
        if(relationship == "SPOUSE") {
          this.form.get('contactPreference').setValue(1);
        } else if(relationship == "MOTHER" || relationship == "FATHER") {
          this.form.get('contactPreference').setValue(1);
          this.form.get('guardian').setValue(true);
        }
      });
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const relationship = this.form.value;
    const req = [];
    req.push(relationship);
    this.relationshipService.updateRelationships(req, this.data.createReciprocal).
      subscribe(() => {
        this.dialogRef.close(relationship);
      });
  }

  cancel() {
    this.dialogRef.close();    
  }
}
